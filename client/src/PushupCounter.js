import React, { useEffect, useRef, useState } from "react";

const PushupCounter = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [poseLandmarker, setPoseLandmarker] = useState(null);
  const [pushupCount, setPushupCount] = useState(0);
  const [pushupStage, setPushupStage] = useState("up");
  const lastVideoTime = useRef(-1);

  const shoulderIndex = 11; // Left shoulder
  const minYThreshold = 0.45;
  const maxYThreshold = 0.55;

  useEffect(() => {
    const loadPoseLandmarker = async () => {
      const vision = await window.FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
      );

      const landmarker = await window.PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numPoses: 1,
      });

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

          for (const landmarks of result.landmarks) {
            drawingUtils.drawLandmarks(landmarks, {
              radius: (data) =>
                window.DrawingUtils.lerp(data.from.z, -0.15, 0.1, 5, 1),
            });
            drawingUtils.drawConnectors(
              landmarks,
              window.PoseLandmarker.POSE_CONNECTIONS
            );

            const shoulderY = landmarks[shoulderIndex].y;

            if (shoulderY > maxYThreshold && pushupStage === "up") {
              setPushupStage("down");
            }

            if (shoulderY < minYThreshold && pushupStage === "down") {
              setPushupStage("up");
              setPushupCount((prev) => prev + 1);
            }

            // Display count
            ctx.font = "30px Arial";
            ctx.fillStyle = "red";
            ctx.fillText(`Push-ups: ${pushupCount}`, 10, 40);
          }
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
      />
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", top: 0, left: 0 }}
      />
    </div>
  );
};

export default PushupCounter;
