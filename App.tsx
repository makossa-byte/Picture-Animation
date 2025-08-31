
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { PromptInput } from './components/PromptInput';
import { ActionButton } from './components/ActionButton';
import { VideoPlayer } from './components/VideoPlayer';
import { Loader } from './components/Loader';
import { ErrorDisplay } from './components/ErrorDisplay';
import { generateVideoFromImage } from './services/geminiService';

const App: React.FC = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [prompt, setPrompt] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string>('');
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const handleImageChange = useCallback((file: File | null) => {
        setImageFile(file);
        setVideoUrl(null); 
        setError(null);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setImageUrl(null);
        }
    }, []);

    const handleGenerateClick = async () => {
        if (!imageFile || !prompt.trim()) {
            setError('Please upload an image and enter a prompt.');
            return;
        }

        setError(null);
        setVideoUrl(null);
        setIsLoading(true);

        const loadingMessages = [
            "Warming up the AI's creative circuits...",
            "Gathering digital stardust...",
            "Teaching pixels to dance...",
            "This can take a few minutes, please wait...",
            "Rendering your masterpiece frame by frame...",
            "Almost there, adding the final touches..."
        ];

        let messageIndex = 0;
        setLoadingMessage(loadingMessages[messageIndex]);
        const interval = setInterval(() => {
            messageIndex = (messageIndex + 1) % loadingMessages.length;
            setLoadingMessage(loadingMessages[messageIndex]);
        }, 5000);

        try {
            const generatedUrl = await generateVideoFromImage(imageFile, prompt);
            setVideoUrl(generatedUrl);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred during video generation.');
        } finally {
            setIsLoading(false);
            clearInterval(interval);
            setLoadingMessage('');
        }
    };
    
    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
            <Header />
            <main className="w-full max-w-4xl mx-auto flex flex-col gap-8 mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-4 p-6 bg-gray-800 rounded-2xl shadow-lg">
                       <ImageUploader onImageChange={handleImageChange} imageUrl={imageUrl} imageFile={imageFile} />
                       <PromptInput prompt={prompt} setPrompt={setPrompt} disabled={isLoading} />
                       <ActionButton onClick={handleGenerateClick} disabled={isLoading || !imageFile || !prompt} />
                    </div>
                    <div className="flex items-center justify-center p-6 bg-gray-800 rounded-2xl shadow-lg min-h-[300px] lg:min-h-full">
                        {isLoading ? (
                            <Loader message={loadingMessage} />
                        ) : error ? (
                            <ErrorDisplay message={error} onRetry={handleGenerateClick} />
                        ) : videoUrl ? (
                            <VideoPlayer src={videoUrl} />
                        ) : (
                             <div className="text-center text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.55a1 1 0 011.45.89V16.11a1 1 0 01-1.45.89L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                <p className="mt-2 text-lg">Your animated video will appear here</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;
