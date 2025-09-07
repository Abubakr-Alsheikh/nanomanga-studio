import { genAI } from "@/lib/gemini";
import { extractJson } from "@/lib/utils";
import { NextResponse } from "next/server";

const MODEL_NAME = "gemini-2.5-flash-lite";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // For debugging, let's see exactly what the server receives
    console.log("Received body in /api/inspire/page:", JSON.stringify(body, null, 2));

    const { storyPlan, previousPagePrompts } = body;

    // --- BULLETPROOF GUARD CLAUSE ---
    // This checks everything: if storyPlan exists, is an object, and has a non-empty pages array.
    if (!storyPlan || typeof storyPlan !== 'object' || !Array.isArray(storyPlan.pages) || storyPlan.pages.length === 0) {
      console.error("Validation failed: storyPlan is missing or invalid in the request body.");
      return NextResponse.json(
        { error: "A valid story plan with a 'pages' array is required to generate a page prompt." },
        { status: 400 }
      );
    }
    // ------------------------------------

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const nextPageNumber = previousPagePrompts.length + 1;
    const targetPagePlan = storyPlan.pages.find(
      (p: any) => p.page === nextPageNumber
    );
    if (!targetPagePlan) {
      return NextResponse.json(
        { error: `Could not find plan for page ${nextPageNumber}.` },
        { status: 400 }
      );
    }

    const prompt = `
      You are a manga panel layout artist. Your task is to describe the panels for page ${nextPageNumber}.
      
      **Overall Story:** ${storyPlan.detailedStorySummary}
      **The main plot point for this page is:** "${targetPagePlan.description}"
      **Previous Page Content:** ${
        previousPagePrompts.join("; ") || "This is the first page."
      }

      Describe a sequence of 3 to 4 panels that visually tell the story for this page. For each panel, describe the shot (e.g., close-up, wide shot), the action, and any dialogue.
      
      Example: "Panel 1: Wide shot of Kenji entering the neon-lit market, looking determined. Panel 2: Close-up on a shadowy figure watching him from an alley. Panel 3: Kenji's eyes narrow. Dialogue: 'I know you're there.'"
      
      Respond with ONLY a valid JSON object containing a single string for the page prompt:
      {"pagePrompt": "Panel 1: ... Panel 2: ..."}
    `;

    const result = await model.generateContent(prompt);
    const cleanedJson = extractJson(result.response.text());
    if (!cleanedJson) throw new Error("AI did not return valid JSON.");

    return NextResponse.json(JSON.parse(cleanedJson));
  } catch (error) {
    console.error("Error in /api/inspire/page:", error);
    return NextResponse.json(
      { error: "Failed to generate page idea." },
      { status: 500 }
    );
  }
}
