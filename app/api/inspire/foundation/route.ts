import { genAI } from "@/lib/gemini";
import { extractJson } from "@/lib/utils";
import { NextResponse } from "next/server";

const MODEL_NAME = "gemini-2.5-flash-lite";

export async function POST() {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const prompt = `
      Generate a unique and fun manga story idea.
      Provide a genre, a short (one-paragraph) story summary, a suitable art style description, and a color style (either "Black and White" or "Colorized").
      
      Respond with ONLY a valid JSON object in the following format:
      {
        "genre": "e.g., Sci-Fi, Fantasy, Slice of Life",
        "storySummary": "A unique and fun one-paragraph story summary.",
        "artStyle": "A descriptive art style, e.g., 'Clean shonen style with dynamic action lines and expressive characters.'",
        "colorStyle": "Black and White"
      }
    `;
    const result = await model.generateContent(prompt);
    const cleanedJson = extractJson(result.response.text());
    if (!cleanedJson) throw new Error("AI did not return valid JSON.");

    return NextResponse.json(JSON.parse(cleanedJson));
  } catch (error) {
    console.error("Error in /api/inspire/foundation:", error);
    return NextResponse.json(
      { error: "Failed to generate foundation idea." },
      { status: 500 }
    );
  }
}
