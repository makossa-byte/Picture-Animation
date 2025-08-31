
import React, { useRef } from 'react';

interface ImageUploaderProps {
    onImageChange: (file: File | null) => void;
    imageUrl: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageChange, imageUrl }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        onImageChange(file);
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div 
            className="w-full h-64 border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-purple-500 hover:text-purple-400 transition-colors duration-300 bg-gray-900/50"
            onClick={handleClick}
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
                    <p className="text-xs text-gray-500">PNG, JPG, or WEBP</p>
                </div>
            )}
        </div>
    );
};
