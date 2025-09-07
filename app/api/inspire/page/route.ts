import { genAI } from "@/lib/gemini";
import { extractJson } from "@/lib/utils";
import { NextResponse } from "next/server";

const MODEL_NAME = "gemini-2.5-flash-lite";

export async function POST(req: Request) {
  try {
    const {
      storySummary,
      characterNames,
      environmentNames,
      previousPagePrompts,
    } = await req.json();

    if (!storySummary) {
      return NextResponse.json(
        { error: "Missing story summary." },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `
      You are an expert manga storyboarder.
      Story Summary: "${storySummary}"
      Available Characters: ${characterNames.join(", ") || "none"}
      Available Environments: ${environmentNames.join(", ") || "none"}
      Previous Page Descriptions (in order):
      ${
        previousPagePrompts
          .map((p: string, i: number) => `${i + 1}. ${p}`)
          .join("\n") || "This is the first page."
      }
      
      Based on all this information, write a compelling and logical description for the *next* manga page.
      The description should be a single, concise sentence or two, perfect for an AI image generator.
      
      Respond with ONLY a valid JSON object in the format:
      {"pagePrompt": "..."}
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
    console.error("Error in /api/inspire/page:", error);
    return NextResponse.json(
      { error: "Failed to generate page idea." },
      { status: 500 }
    );
  }
}
