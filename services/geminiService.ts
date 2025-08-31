import { GoogleGenAI } from "@google/genai";

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // remove the data:mime/type;base64, part
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateVideoFromImage = async (imageFile: File, prompt: string): Promise<string> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
        const base64Image = await fileToBase64(imageFile);

        console.log("Starting video generation...");
        let operation = await ai.models.generateVideos({
            model: 'veo-2.0-generate-001',
            prompt: prompt,
            image: {
                imageBytes: base64Image,
                mimeType: imageFile.type,
            },
            config: {
                numberOfVideos: 1,
            }
        });

        console.log("Polling for video generation status...");
        while (!operation.done) {
            await delay(10000); // Poll every 10 seconds
            operation = await ai.operations.getVideosOperation({ operation: operation });
            console.log("Current operation status:", operation.name, "Done:", operation.done);
        }

        if (operation.error) {
            throw new Error(`Video generation failed: ${operation.error.message}`);
        }

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

        if (!downloadLink) {
            throw new Error("Video generation succeeded, but no download link was found.");
        }

        console.log("Fetching generated video from:", downloadLink);
        // The response.body contains the MP4 bytes. You must append an API key when fetching from the download link.
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch video. Status: ${response.statusText}`);
        }

        const videoBlob = await response.blob();
        console.log("Video downloaded successfully.");
        
        return URL.createObjectURL(videoBlob);

    } catch (error) {
        console.error("Error in generateVideoFromImage:", error);

        // Default error message
        let userFriendlyMessage = "An unexpected error occurred while generating the video. Please try again later.";

        // Attempt to parse a more specific error from the API response
        let errorMessage = '';
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'object' && error !== null) {
            errorMessage = (error as any).message || JSON.stringify(error);
        } else {
            errorMessage = String(error);
        }

        if (errorMessage.includes("RESOURCE_EXHAUSTED") || errorMessage.includes("429")) {
            userFriendlyMessage = "API quota exceeded. Please check your plan and billing details, or wait a while before trying again.";
        } else if (errorMessage.toLowerCase().includes("api key")) {
            userFriendlyMessage = "Invalid or missing API Key. Please ensure your API_KEY is set correctly in your environment.";
        }
        
        // Throw a new error with the user-friendly message, which will be caught by the UI component.
        throw new Error(userFriendlyMessage);
    }
};