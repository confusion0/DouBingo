import { useEffect, useRef, useState } from "react";

import { useMessage } from "../context/MessageContext";
import { useAuthToken } from '../context/AuthTokenContext';

import { renderDatalessQuery, useBackendQuery } from "../utils/QueryUtils";

import Button from "./Button";

interface IBingoData {
    found: boolean[][];
    animals: string[][];
}

function BingoGameInner({ initialBingoData }: { initialBingoData: IBingoData }) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    const { addMessage } = useMessage();
    const { token } = useAuthToken();

    const [animals, setAnimals] = useState<string[][]>(initialBingoData.animals);
    const [found, setFound] = useState<boolean[][]>(initialBingoData.found);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    
    const flatFound = found.flat();

    useEffect(() => {
        const startCamera = async () => {
            try {
                if(videoRef.current) {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    videoRef.current.srcObject = stream;
                }
            } catch(err) {
                addMessage("Error accessing webcam: " + err, "default");
            }
        };
    
        startCamera();
    }, []);
    
    const captureImage = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
    
        if(video && canvas) {
            const context = canvas.getContext('2d');
    
            if(context) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
    
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
                const imageData = canvas.toDataURL('image/png');
    
                setCapturedImage(imageData);
                checkBingo(imageData);
            }
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
    
        if(file) {
            const reader = new FileReader();
    
            reader.onloadend = () => {
                const imageData = reader.result as string;

                setCapturedImage(imageData);
                checkBingo(imageData);
            };
    
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = () => {
        fileInputRef.current?.click();
    };

    const checkBingo = async (imageDataUrl: string) => {
        try {
            const formData = new FormData();

            const response = await fetch(imageDataUrl);
            const blob = await response.blob();

            formData.append('image', blob, 'capture.png');

            addMessage("Checking bingo...", "loading", 7500);

            const request = await fetch('http://localhost:8000/detect-animal', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                body: formData
            });

            const data = await request.json();

            setCapturedImage(null);

            if(!request.ok) {
                addMessage(data.error, "default");
                return;
            }
            
            addMessage("✅ Detected animal: " + data.detected, "default", 7500);
            
            if(data.bingo) {
                addMessage(`🙏 Bingo! +${data.points} points`, "default", 7500);
            } else {
                addMessage("❌ Not a bingo", "default", 7500);
            }

            setFound(data.found);
            setAnimals(data.animals);
        } catch(error) {
            addMessage("Error checking bingo: " + error, "default");
        } 
    };
    
    return (
        <>  
            <section className="container py-16 flex flex-col text-center">
                <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
                    {animals.flat().map((animal, index) => (
                        <div
                            key={index}
                            className={
                                `relative bg-cover border border-gray-300 ` +
                                `text-accent-foreground text-wrap break-keep` // + (flatFound[index] ? "" : " cursor-pointer")
                            }
                            style={{
                                backgroundImage: `url(./${animal.toLowerCase().replace(/\s+/g, '_')}.jpg)`, userSelect: "none"
                            }}
                        >
                            <div style={{
                                top: "0", left: "0", height: "100%", filter: flatFound[index] ? "brightness(0.5)" : undefined,
                                backgroundImage: `url(./${animal.toLowerCase().replace(/\s+/g, '_')}.jpg)`,
                                backgroundSize: "cover", backgroundPosition: "center",
                                display: "flex", justifyContent: "center"
                            }} className="p-6">
                                <p style={{
                                    transform: (flatFound[index] ? " translateY(10px)" : ""),
                                    textShadow: "black 0 0 5px, black 0 0 10px", display: "flex", alignItems: "center"
                                }}>
                                    {animal}
                                </p>
                            </div>
                            {
                                flatFound[index] && (
                                    <div style={{
                                        position: "absolute", top: "0", left: "0", width: "100%", height: "100%",
                                        transform: "translateY(25%)" //, userSelect: "none"
                                    }}>
                                        ✅
                                    </div>
                                )
                            }
                        </div>
                    ))}
                </div>
            </section>

            <section
                className="container max-w-screen-2xl flex flex-col items-center space-y-8 text-center"
                style={{ marginBottom: "4em" }}
            >
                <div className="flex flex-row item-center justify-center gap-4">
                    <Button onClick={captureImage} size="sm">
                        Capture
                    </Button>

                    <span style={{ position: "relative", top: "4px" }}>
                        or
                    </span>

                    <Button size="sm" onClick={handleUpload}>
                        Select Image
                    </Button>
                </div>
                
                <video ref={videoRef} autoPlay playsInline className="rounded-md shadow-md w-full max-w-md" />

                <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                />

                <canvas ref={canvasRef} className="hidden" />

                {capturedImage && (
                    <div>
                        <h3 className="text-lg">Captured Image:</h3>

                        <img src={capturedImage} alt="Captured" className="rounded-md shadow" />
                    </div>
                )}
            </section>
        </>
    );
}

export default function BingoGame() {
    const bingoDataQuery = useBackendQuery<IBingoData>("bingo-data");

    if(bingoDataQuery.status !== 'success') {
        return renderDatalessQuery(bingoDataQuery);
    }

    return (
        <BingoGameInner initialBingoData={ bingoDataQuery.data } />
    );
};
