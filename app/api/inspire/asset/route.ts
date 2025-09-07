import { genAI } from "@/lib/gemini";
import { extractJson } from "@/lib/utils";
import { NextResponse } from "next/server";

const MODEL_NAME = "gemini-2.5-flash-lite";

export async function POST(req: Request) {
  try {
    const { assetType, storySummary, existingAssetNames } = await req.json();

    if (!assetType || !storySummary) {
      return NextResponse.json(
        { error: "Missing required context." },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `
      You are an expert manga author's assistant.
      The story summary is: "${storySummary}".
      
      Generate a new, creative ${assetType} for this story.
      Do NOT use any of the following names: ${
        existingAssetNames.join(", ") || "none"
      }.

      Respond with ONLY a valid JSON object in the format:
      {"name": "...", "prompt": "..."}
      
      The prompt should be a concise, descriptive sentence for an AI image generator.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const cleanedJson = extractJson(responseText);
    if (!cleanedJson) {
      throw new Error("AI did not return a valid JSON object.");
    }
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
