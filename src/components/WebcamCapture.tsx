import React, { useEffect, useRef, useState } from 'react';

import { useMessage } from '../context/MessageContext';
import Button from './Button';

const WebcamCapture: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);

    const { addMessage } = useMessage();

    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                addMessage('Error accessing webcam: ' + err, 'default');
            }
        };

        startCamera();
    }, []);

    const captureImage = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (video && canvas) {
            const context = canvas.getContext('2d');

            if (context) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;

                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                const imageData = canvas.toDataURL('image/png');

                setCapturedImage(imageData);
            }
        }
    };

    return (
        <section className="container min-h-[calc(100vh-3.5rem)] max-w-screen-2xl flex flex-col items-center space-y-8 py-24 text-center md:py-32">
            <video ref={videoRef} autoPlay playsInline className="rounded-md shadow-md w-full max-w-md" />

            <Button onClick={captureImage} size="sm">
                Capture
            </Button>

            <canvas ref={canvasRef} className="hidden" />

            {capturedImage && (
                <div>
                    <h3 className="text-lg">Captured Image:</h3>

                    <img src={capturedImage} alt="Captured" className="rounded-md shadow" />
                </div>
            )}
        </section>
    );
};

export default WebcamCapture;