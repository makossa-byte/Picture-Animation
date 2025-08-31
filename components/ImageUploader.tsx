import React, { useRef, useState, useCallback } from 'react';

interface ImageUploaderProps {
    onImageChange: (file: File | null) => void;
    imageUrl: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageChange, imageUrl }) => {
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
                    <div className="text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="mt-2">Click to upload an image</p>
                        <p className="text-xs text-gray-500 my-2">or</p>
                         <button 
                            onClick={handleOpenCamera} 
                            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors z-10"
                        >
                            Use Camera
                        </button>
                    </div>
                )}
            </div>

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