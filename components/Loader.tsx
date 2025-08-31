
import React from 'react';

interface LoaderProps {
    message: string;
}

export const Loader: React.FC<LoaderProps> = ({ message }) => {
    return (
        <div className="flex flex-col items-center justify-center text-center text-gray-300">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-purple-500"></div>
            <p className="mt-4 text-lg font-semibold">Generating Video...</p>
            <p className="mt-2 text-sm text-gray-400">{message}</p>
        </div>
    );
};
