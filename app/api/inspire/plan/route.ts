import { genAI, GEMINI_TEXT_MODEL_NAME } from "@/lib/gemini"; // Import the new constant
import { extractJson } from "@/lib/utils";
import { NextResponse } from "next/server";

const MODEL_NAME = GEMINI_TEXT_MODEL_NAME;

export async function POST(req: Request) {
  try {
    const { genre, storySummary, artStyle, colorStyle, numPages } =
      await req.json();
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    // --- UPGRADED STORY PLAN PROMPT ---
    const prompt = `
      You are a master manga editor and storyteller. Your task is to expand a basic idea into a dramatic and engaging plan for a ${numPages}-page one-shot manga.

      **Input Idea:**
      - Genre: ${genre}
      - Summary: ${storySummary}
      - Art Style: ${artStyle}
      - Color Style: ${colorStyle}

      **Your Task:**
      1.  **Detailed Story Summary:** Expand the summary into a compelling narrative (2-3 paragraphs) with clear stakes, character motivations, and a hint of the central conflict.
      2.  **Detailed Art Style:** Elaborate on the art style, suggesting specific visual techniques that would enhance the story's mood (e.g., "heavy use of dramatic shadows and speed lines for action scenes," or "soft, detailed backgrounds for emotional moments").
      3.  **Characters & Environments:** List the essential characters and environments with descriptions that are concise but full of personality and visual cues.
      4.  **Engaging Page Breakdown:** This is the most important part. Create a page-by-page plot outline for all ${numPages} pages. The plot **must follow a clear narrative arc**:
          - **Introduction (First ~25% of pages):** Introduce the hero and their world.
          - **Rising Action (Next ~50%):** Introduce the conflict and build tension.
          - **Climax (Next ~15%):** The peak of the conflict.
          - **Resolution (Final ~10%):** A satisfying conclusion.
          Each page description must represent a **dynamic event, a key decision, or an emotional beat**, not just a static scene. Make each page feel like it matters.

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
