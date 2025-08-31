
import React from 'react';

interface PromptInputProps {
    prompt: string;
    setPrompt: (prompt: string) => void;
    disabled: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({ prompt, setPrompt, disabled }) => {
    return (
        <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
                Animation Prompt
            </label>
            <textarea
                id="prompt"
                rows={3}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 placeholder-gray-400 text-white disabled:opacity-50"
                placeholder="e.g., 'A cinematic shot of a cat driving a car through a neon city at night.'"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={disabled}
            />
        </div>
    );
};
