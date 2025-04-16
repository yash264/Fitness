import React, { useEffect, useRef, useState } from 'react';
import { createDetector, SupportedModels } from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import ReactPlayer from "react-player";

export default function FitnessDetector({ mode = 'pushup' }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const detectorRef = useRef(null);

    const [pushupCount, setPushupCount] = useState(0);
    const [isDown, setIsDown] = useState(false);

    const [plankStart, setPlankStart] = useState(null);
    const [plankTime, setPlankTime] = useState(0);

    useEffect(() => {
        let intervalId;

        async function init() {
            try {
                // 🔧 Set and await backend initialization
                await tf.setBackend('webgl'); // 'webgl' is fast & widely supported
                await tf.ready();

                // ✅ Create the pose detector
                const detector = await createDetector(SupportedModels.MoveNet, {
                    modelType: 'SinglePose.Lightning',
                });
                detectorRef.current = detector;

                // 🎥 Set up the webcam
                const video = videoRef.current;
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });

                if (video) {
                    video.srcObject = stream;
                    video.onloadedmetadata = async () => {
                        await video.play();

                        // 🔁 Start detecting pose every 100ms
                        intervalId = setInterval(() => {
                            detectPose();
                        }, 100);
                    };
                }
            } catch (err) {
                console.error("Error initializing TensorFlow or camera:", err);
            }
        }

        init();

        return () => clearInterval(intervalId);
    }, []);

    const detectPose = async () => {
        const detector = detectorRef.current;
        if (!detector || !videoRef.current) return;

        const poses = await detector.estimatePoses(videoRef.current);
        if (poses.length === 0) return;

        const keypoints = poses[0].keypoints.reduce((acc, kp) => {
            acc[kp.name] = kp;
            return acc;
        }, {});
        // console.log(keypoints);

        const leftShoulder = keypoints['left_shoulder'];
        const leftElbow = keypoints['left_elbow'];
        const leftHip = keypoints['left_hip'];
        const rightShoulder = keypoints['right_shoulder'];
        const rightHip = keypoints['right_hip'];
        const rightKnee = keypoints['right_knee'];

        if (mode === 'pushup') {
            if (leftShoulder.score > 0.5 && leftElbow.score > 0.5) {
                const diff = leftShoulder.y - leftElbow.y;

                if (diff > 40 && !isDown) {
                    setIsDown(true);
                } else if (diff < 20 && isDown) {
                    setIsDown(false);
                    setPushupCount((prev) => prev + 1);
                }
            }
        }

        if (mode === 'plank') {
            if (rightShoulder && rightHip && rightKnee) {
                const angle = getAngle(rightShoulder, rightHip, rightKnee);
                if (angle > 160 && angle < 200) {
                    if (!plankStart) {
                        setPlankStart(Date.now());
                    } else {
                        setPlankTime(Math.floor((Date.now() - plankStart) / 1000));
                    }
                } else {
                    setPlankStart(null);
                }
            }
        }
    };

    const getAngle = (a, b, c) => {
        const ab = { x: b.x - a.x, y: b.y - a.y };
        const cb = { x: b.x - c.x, y: b.y - c.y };

        const dot = ab.x * cb.x + ab.y * cb.y;
        const magAB = Math.sqrt(ab.x * ab.x + ab.y * ab.y);
        const magCB = Math.sqrt(cb.x * cb.x + cb.y * cb.y);

        const angle = (Math.acos(dot / (magAB * magCB)) * 180) / Math.PI;
        return angle;
    };

    return (
        <div>
            <h2>{mode === 'pushup' ? `Push-ups: ${pushupCount}` : `Plank Time: ${plankTime}s`}</h2>
            <video ref={videoRef} width="640" height="200" style={{ display: 'block' }} />
            <canvas ref={canvasRef} width="640" height="200" style={{ display: 'none' }} />
        </div>
    );
}
