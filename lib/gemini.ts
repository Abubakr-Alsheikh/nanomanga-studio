import { GoogleGenerativeAI } from "@google/generative-ai";

// Get the API key from environment variables
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined in environment variables.");
}

// Initialize the GoogleGenerativeAI instance
const genAI = new GoogleGenerativeAI(apiKey);

// Define the model name as a constant for easy reuse
export const NANO_BANANA_MODEL_NAME = "gemini-2.5-flash-image-preview";

// Export the initialized client
export { genAI };
