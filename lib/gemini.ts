import { GoogleGenerativeAI } from "@google/generative-ai";

// Get the API key from environment variables
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined in environment variables.");
}

// Initialize the GoogleGenerativeAI instance
const genAI = new GoogleGenerativeAI(apiKey);

export const GEMINI_IMAGE_MODEL_NAME =
  process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image-preview";
export const GEMINI_TEXT_MODEL_NAME =
  process.env.GEMINI_TEXT_MODEL || "gemini-2.5-flash";

// Export the initialized client
export { genAI };
