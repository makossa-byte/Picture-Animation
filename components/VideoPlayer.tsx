import React, { useState, useRef, useEffect } from 'react';

interface VideoPlayerProps {
    src: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ src }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [speed, setSpeed] = useState<number>(1);

    const handleDownload = () => {
        // Create a temporary link element to trigger the download
        const link = document.createElement('a');
        link.href = src;
        link.setAttribute('download', 'animated-video.mp4');

        // Append to the document, click it, and then remove it
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSpeed = parseFloat(e.target.value);
        setSpeed(newSpeed);
    };

    // Effect to update the video's playback rate when the speed state changes
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = speed;
        }
    }, [speed, src]); // Also depend on 'src' to re-apply speed if the video source changes

    return (
        <div className="w-full">
            <div className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow-xl">
                <video
                    ref={videoRef}
                    src={src}
                    controls
                    autoPlay
                    loop
                    muted
                    className="w-full h-full object-contain"
                >
                    Your browser does not support the video tag.
                </video>
            </div>
            <div className="mt-4 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
                 <div className="flex items-center gap-2">
                    <label htmlFor="speed-control" className="text-sm font-medium text-gray-300">Speed:</label>
                    <select
                        id="speed-control"
                        value={speed}
                        onChange={handleSpeedChange}
                        className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-2 focus:ring-purple-500 transition-colors duration-200"
                    >
                        <option value={0.5}>0.5x</option>
                        <option value={1}>1x (Normal)</option>
                        <option value={1.5}>1.5x</option>
                        <option value={2}>2x</option>
                    </select>
                 </div>
                 <button
                    onClick={handleDownload}
                    className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 focus:outline-none focus:ring-4 focus:ring-green-500/50"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    <span>Download Video</span>
                </button>
            </div>
        </div>
    );
};