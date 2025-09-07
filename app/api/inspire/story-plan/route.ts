import { genAI } from "@/lib/gemini";
import { extractJson } from "@/lib/utils";
import { NextResponse } from "next/server";

const MODEL_NAME = "gemini-2.5-flash-lite";

export async function POST(req: Request) {
  try {
    const { storySummary, numPages } = await req.json();

    if (!storySummary || !numPages) {
      return NextResponse.json({ error: "Story summary and number of pages are required." }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    // This is a complex, highly-structured prompt. It's the key to this feature.
    const prompt = `
      You are a master manga storyteller and planner.
      Your task is to break down a story concept into a structured plan for a short manga.

      The story summary is: "${storySummary}"

      Create a plan for a short manga of exactly ${numPages} pages.
      The plan must include:
      1. A list of essential characters with brief descriptions.
      2. A list of key environments with brief descriptions.
      3. A page-by-page breakdown, with a concise one-sentence description for each page's content.

      Respond with ONLY a valid JSON object in the following format:
      {
        "characters": [
          {"name": "Character Name", "description": "Brief character description."},
          ...
        ],
        "environments": [
          {"name": "Environment Name", "description": "Brief environment description."},
          ...
        ],
        "pages": [
          {"page": 1, "description": "A concise summary of what happens on this page."},
          {"page": 2, "description": "A concise summary of what happens on this page."},
          ...
        ]
      }
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
    console.error("Error in /api/inspire/story-plan:", error);
    return NextResponse.json({ error: "Failed to generate story plan." }, { status: 500 });
  }
}
