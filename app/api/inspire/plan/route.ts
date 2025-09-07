import { genAI } from "@/lib/gemini";
import { extractJson } from "@/lib/utils";
import { NextResponse } from "next/server";

const MODEL_NAME = "gemini-2.5-flash-lite";

export async function POST(req: Request) {
  try {
    const { genre, storySummary, artStyle, colorStyle, numPages } =
      await req.json();

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const prompt = `
      You are a master manga storyteller. Your task is to expand a basic idea into a detailed plan for a ${numPages}-page manga.

      **Input Idea:**
      - Genre: ${genre}
      - Summary: ${storySummary}
      - Art Style: ${artStyle}
      - Color Style: ${colorStyle}

      **Your Task:**
      1.  **Detailed Story Summary:** Expand the initial summary into a more detailed, compelling narrative (2-3 paragraphs).
      2.  **Detailed Art Style:** Elaborate on the art style, mentioning specific techniques (e.g., screentones for B&W, cel-shading for color).
      3.  **Characters & Environments:** List 2-3 key characters and 1-2 key environments with descriptions.
      4.  **Page Breakdown:** Create a page-by-page plot outline for all ${numPages} pages. The plot should have a clear beginning, middle, and a satisfying conclusion. Each page description should be a significant plot point.

      Respond with ONLY a valid JSON object in the IStoryPlan format:
      {
        "detailedStorySummary": "...",
        "detailedArtStyle": "...",
        "characters": [{"name": "...", "description": "..."}],
        "environments": [{"name": "...", "description": "..."}],
        "pages": [{"page": 1, "description": "..."}, ...]
      }
    `;

    const result = await model.generateContent(prompt);

    const cleanedJson = extractJson(result.response.text());
    if (!cleanedJson) throw new Error("AI did not return valid JSON.");

    return NextResponse.json(JSON.parse(cleanedJson));
  } catch (error) {
    console.error("Error in /api/inspire/plan:", error);
    return NextResponse.json(
      { error: "Failed to generate story plan." },
      { status: 500 }
    );
  }
}
