import { genAI } from "@/lib/gemini";
import { extractJson } from "@/lib/utils";
import { NextResponse } from "next/server";

const MODEL_NAME = "gemini-2.5-flash-lite";

export async function POST(req: Request) {
  try {
    const { assetType, name, description } = await req.json();
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    let prompt: string;

    if (assetType === "character") {
      // --- UPGRADED CHARACTER PROMPT ---
      prompt = `
        You are a professional character concept artist for a manga studio. Your task is to create a detailed prompt for an AI image generator to produce a full-body character sheet.

        The character is named "${name}" and is described as: "${description}".

        Create an image generation prompt that describes:
        1. A **full-body shot** of the character.
        2. A dynamic or expressive pose that reflects their personality.
        3. A clear view of their face, clothing, and any unique features (scars, accessories, etc.).
        4. A **simple, neutral, or white background** to ensure the character is the sole focus.
        5. The overall mood or aura they should exude.
        
        The final prompt should be a concise, visually rich sentence.

        Respond with ONLY a valid JSON object in the format:
        {"prompt": "..."}
      `;
    } else {
      // assetType === 'environment'
      // --- UPGRADED ENVIRONMENT PROMPT ---
      prompt = `
        You are a background and world-building artist for a manga studio. Your task is to create a detailed prompt for an AI image generator to produce key background art.

        The environment is named "${name}" and is described as: "${description}".

        Create an image generation prompt that describes:
        1. A wide, **establishing shot** of the environment.
        2. The specific atmosphere, mood, and lighting (e.g., moody, rain-soaked, sun-drenched, ominous).
        3. Key architectural or natural details that define the location.
        4. The prompt **MUST explicitly state that there should be NO characters or people in the image**. The focus is solely on the world itself.

        The final prompt should be a concise, visually rich sentence.

        Respond with ONLY a valid JSON object in the format:
        {"prompt": "..."}
      `;
    }

    const result = await model.generateContent(prompt);
    const cleanedJson = extractJson(result.response.text());
    if (!cleanedJson) throw new Error("AI did not return valid JSON.");

    const responseObject = JSON.parse(cleanedJson);
    return NextResponse.json(responseObject);
  } catch (error) {
    console.error("Error in /api/inspire/asset:", error);
    return NextResponse.json(
      { error: "Failed to generate asset idea." },
      { status: 500 }
    );
  }
}
