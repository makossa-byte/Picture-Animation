
import React from 'react';

interface ActionButtonProps {
    onClick: () => void;
    disabled: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ onClick, disabled }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="w-full py-3 px-4 font-semibold text-lg text-white rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100"
        >
            Generate Animation
        </button>
    );
};
