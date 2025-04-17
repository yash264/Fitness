import React, { useEffect, useRef, useState } from "react";

const BicepCurlCounter = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [poseLandmarker, setPoseLandmarker] = useState(null);

  const [curlCount, setCurlCount] = useState(0);
  const curlCountRef = useRef(0);

  const [curlStage, setCurlStage] = useState("up");
  const curlStageRef = useRef("up");

  const lastVideoTime = useRef(-1);

  const shoulderIndex = 11; // Left shoulder
  const elbowIndex = 13; // Left elbow
  const wristIndex = 15; // Left wrist

  const minAngleThreshold = 40;
  const maxAngleThreshold = 170;

  useEffect(() => {
    const loadPoseLandmarker = async () => {
      const vision = await window.FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
      );

      const landmarker = await window.PoseLandmarker.createFromOptions(
        vision,
        {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numPoses: 1,
        }
      );

      setPoseLandmarker(landmarker);
    };

    loadPoseLandmarker();
  }, []);

  useEffect(() => {
    if (poseLandmarker) {
      startWebcam();
    }
  }, [poseLandmarker]);

  const startWebcam = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      alert("Webcam not supported");
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const video = videoRef.current;
    video.srcObject = stream;

    video.onloadeddata = () => {
      video.play();
      predictWebcam();
    };
  };

  const calculateAngle = (p1, p2, p3) => {
    const angle =
      Math.atan2(p3.y - p2.y, p3.x - p2.x) -
      Math.atan2(p1.y - p2.y, p1.x - p2.x);
    let deg = (angle * 180) / Math.PI;
    if (deg < 0) deg += 360;
    return deg > 180 ? 360 - deg : deg;
  };

  const predictWebcam = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const drawingUtils = new window.DrawingUtils(ctx);

    const detectFrame = () => {
      if (lastVideoTime.current !== video.currentTime) {
        lastVideoTime.current = video.currentTime;

        const now = performance.now();
        poseLandmarker.detectForVideo(video, now, (result) => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          if (!result.landmarks || result.landmarks.length === 0) return;

          const landmarks = result.landmarks[0];

          drawingUtils.drawLandmarks(landmarks);
          drawingUtils.drawConnectors(
            landmarks,
            window.PoseLandmarker.POSE_CONNECTIONS
          );

          const shoulder = landmarks[shoulderIndex];
          const elbow = landmarks[elbowIndex];
          const wrist = landmarks[wristIndex];

          if (shoulder && elbow && wrist) {
            const angle = calculateAngle(shoulder, elbow, wrist);

            // Count curls
            if (angle < minAngleThreshold && curlStageRef.current === "up") {
              curlStageRef.current = "down";
              console.log("Down")
              setCurlStage("down");
            }
            if (angle > maxAngleThreshold && curlStageRef.current === "down") {
              curlStageRef.current = "up";
              curlCountRef.current += 1;
              console.log("Up")
              setCurlStage("up");
              setCurlCount(curlCountRef.current);
            }

            // Draw angle near elbow
            const x = elbow.x * canvas.width;
            const y = elbow.y * canvas.height;

            ctx.fillStyle = "blue";
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, 2 * Math.PI);
            ctx.fill();

            ctx.font = "20px Arial";
            ctx.fillStyle = "blue";
            ctx.fillText(`Angle: ${angle.toFixed(1)}°`, x + 10, y - 10);
          }

          // Draw curl count
          ctx.font = "30px Arial";
          ctx.fillStyle = "red";
          ctx.fillText(`Biceps Curls: ${curlCountRef.current}`, 10, 40);
        });
      }

      requestAnimationFrame(detectFrame);
    };

    detectFrame();
  };

  return (
    <div style={{ position: "relative", width: 640, height: 480 }}>
      <video
        ref={videoRef}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        playsInline
        muted
      />
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", top: 0, left: 0 }}
      />
    </div>
  );
};

export default BicepCurlCounter;
