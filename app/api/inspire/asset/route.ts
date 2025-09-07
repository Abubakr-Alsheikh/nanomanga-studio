import { genAI } from "@/lib/gemini";
import { extractJson } from "@/lib/utils";
import { NextResponse } from "next/server";

const MODEL_NAME = "gemini-2.5-flash-lite";

export async function POST(req: Request) {
  try {
    const { assetType, name, description } = await req.json();

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `
      You are an AI assistant for a manga artist. Your job is to take a brief character or environment description and turn it into a detailed, descriptive prompt for an AI image generator. The prompt should be a single, descriptive sentence focusing on visual details.
      
      The ${assetType} is named "${name}" and is described as: "${description}".
      
      Create the image generation prompt.
      
      Respond with ONLY a valid JSON object in the format:
      {"prompt": "..."}
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanedJson = extractJson(responseText);
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
