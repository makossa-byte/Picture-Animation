import React, { useRef, useState, useCallback } from 'react';

interface ImageUploaderProps {
    onImageChange: (file: File | null) => void;
    imageUrl: string | null;
    imageFile: File | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageChange, imageUrl, imageFile }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const streamRef = useRef<MediaStream | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        onImageChange(file);
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const stopCameraStream = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    }, []);

    const handleOpenCamera = useCallback(async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
                setIsCameraOpen(true);
            } catch (err) {
                console.error("Error accessing camera:", err);
                alert("Could not access the camera. Please ensure you have granted permission.");
            }
        } else {
            alert("Your browser does not support camera access.");
        }
    }, []);

    const handleCloseCamera = useCallback(() => {
        stopCameraStream();
        setIsCameraOpen(false);
    }, [stopCameraStream]);

    const handleCapture = useCallback(() => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            if (context) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                canvas.toBlob((blob) => {
                    if (blob) {
                        const capturedFile = new File([blob], `capture-${Date.now()}.png`, { type: 'image/png' });
                        onImageChange(capturedFile);
                    }
                }, 'image/png');
            }
            handleCloseCamera();
        }
    }, [onImageChange, handleCloseCamera]);

    const handleDownload = () => {
        if (!imageUrl || !imageFile) return;
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = imageFile.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
            <div 
                className="w-full h-64 border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-purple-500 hover:text-purple-400 transition-colors duration-300 bg-gray-900/50"
                onClick={imageUrl ? undefined : handleClick}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/png, image/jpeg, image/webp"
                />
                {imageUrl ? (
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-contain rounded-lg p-1" />
                ) : (
                    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden rounded-lg">
                        <img 
                            src="https://images.unsplash.com/photo-1696208261241-e13710330945?q=80&w=800&auto=format&fit=crop" 
                            alt="AI placeholder" 
                            className="absolute inset-0 w-full h-full object-cover opacity-20"
                        />
                        <div className="relative z-10 text-center p-4">
                            <p className="mt-2 text-white font-semibold">Click to upload an image</p>
                            <p className="text-xs text-gray-300 my-2">or</p>
                             <button 
                                onClick={handleOpenCamera} 
                                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors z-10"
                            >
                                Use Camera
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {imageUrl && imageFile && (
                <div className="mt-2 p-2 bg-gray-700 rounded-lg flex items-center justify-between text-sm">
                    <span className="text-gray-300 truncate font-mono text-xs" title={imageFile.name}>
                        {imageFile.name}
                    </span>
                    <button
                        onClick={handleDownload}
                        className="ml-4 px-5 py-2.5 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        <span>Download Image</span>
                    </button>
                </div>
            )}

            {isCameraOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50 p-4">
                    <video ref={videoRef} autoPlay playsInline className="max-w-full max-h-[75vh] w-auto h-auto rounded-lg shadow-2xl" muted></video>
                    <div className="mt-4 flex gap-4">
                        <button onClick={handleCapture} className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">
                            Capture
                        </button>
                        <button onClick={handleCloseCamera} className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700">
                            Cancel
                        </button>
                    </div>
                </div>
            )}
            <canvas ref={canvasRef} className="hidden"></canvas>
        </>
    );
};