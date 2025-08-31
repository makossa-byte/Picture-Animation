
import React from 'react';

interface ErrorDisplayProps {
    message: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
    return (
        <div className="w-full p-4 bg-red-900/50 border border-red-500 rounded-lg text-center text-red-300">
            <h3 className="font-bold">An Error Occurred</h3>
            <p className="text-sm mt-1">{message}</p>
        </div>
    );
};
