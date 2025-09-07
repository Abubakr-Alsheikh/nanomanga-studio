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
      storyPlanPages,
      previousPagePrompts,
    } = await req.json();

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const nextPageNumber = previousPagePrompts.length + 1;
    const targetPagePlan = storyPlanPages.find(
      (p: any) => p.page === nextPageNumber
    );

    if (!targetPagePlan) {
      return NextResponse.json(
        { error: `Could not find plan for page ${nextPageNumber}.` },
        { status: 400 }
      );
    }

    const prompt = `
      You are a master manga storyboarder. Your task is to write the prompt for page ${nextPageNumber} of a manga.

      **Overall Story:** "${storySummary}"
      **Characters in this story:** ${characterNames.join(", ") || "N/A"}
      **Environments in this story:** ${environmentNames.join(", ") || "N/A"}

      **The Plan for Page ${nextPageNumber} is:** "${
      targetPagePlan.description
    }"
      
      **Content of previous pages:**
      ${
        previousPagePrompts
          .map((p: string, i: number) => `Page ${i + 1}: ${p}`)
          .join("\n") || "This is the first page."
      }
      
      Based on all of this context, write a detailed and compelling image generation prompt for page ${nextPageNumber}.
      The prompt MUST adhere to the plan for this page.
      It MUST be a single, descriptive sentence or two.
      It MUST include a short line of dialogue in quotes (e.g., "What was that?!") if it fits the scene.

      Respond with ONLY a valid JSON object in the format:
      {"pagePrompt": "..."}
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanedJson = extractJson(responseText);
    if (!cleanedJson) throw new Error("AI did not return valid JSON.");

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
