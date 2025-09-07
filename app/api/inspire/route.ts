import { genAI } from "@/lib/gemini";
import { extractJson } from "@/lib/utils";
import { NextResponse } from "next/server";

// We'll use the lightweight text model for this
const INSPIRATION_MODEL_NAME = "gemini-2.5-flash-lite";

export async function POST() {
  try {
    const model = genAI.getGenerativeModel({ model: INSPIRATION_MODEL_NAME });

    // This prompt is crucial. We ask the AI to return ONLY a valid JSON object.
    // This makes it easy and safe to parse on the frontend.
    const prompt = `
      Generate a creative and compelling manga story idea.
      Provide a one-paragraph story summary and a corresponding art style description suitable for a manga.
      
      Respond with ONLY a valid JSON object in the following format:
      {"storySummary": "...", "artStyle": "..."}
    `;

    console.log("Sending request to Gemini for a story idea...");
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const cleanedJson = extractJson(responseText);
    if (!cleanedJson) {
      throw new Error("AI did not return a valid JSON object.");
    }

    const responseObject = JSON.parse(cleanedJson);

    // Validate the response object to ensure it has the expected keys.
    if (!responseObject.storySummary || !responseObject.artStyle) {
      throw new Error("Invalid response format from AI model.");
    }

    return NextResponse.json(responseObject);
  } catch (error) {
    console.error("Error in /api/inspire:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return NextResponse.json(
      { error: "Failed to generate story idea.", details: errorMessage },
      { status: 500 }
    );
  }
}
