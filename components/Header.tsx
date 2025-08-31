
import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="w-full max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                Picture Animator AI
            </h1>
            <p className="mt-2 text-lg text-gray-300">
                Bring your images to life with the power of generative AI.
            </p>
        </header>
    );
};
