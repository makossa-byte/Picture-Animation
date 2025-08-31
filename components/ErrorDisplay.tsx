
import React from 'react';

interface ErrorDisplayProps {
    message: string;
    onRetry: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => {
    return (
        <div className="w-full p-4 bg-red-900/50 border border-red-500 rounded-lg text-center text-red-300 flex flex-col items-center gap-4">
            <div>
                <h3 className="font-bold">An Error Occurred</h3>
                <p className="text-sm mt-1">{message}</p>
            </div>
            <button
                onClick={onRetry}
                className="px-6 py-2 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
                Retry
            </button>
        </div>
    );
};