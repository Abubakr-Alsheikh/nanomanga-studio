import { genAI, NANO_BANANA_MODEL_NAME } from "@/lib/gemini";
import { Part } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Define the expected request body structure
interface GenerationRequest {
  prompt: string;
  // Array of base64 encoded images
  baseImages?: string[];
}

export async function POST(req: Request) {
  try {
    const body: GenerationRequest = await req.json();
    const { prompt, baseImages } = body;

    // --- 1. Validate Input ---
    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required." },
        { status: 400 }
      );
    }

    // --- 2. Initialize the Model ---
    const model = genAI.getGenerativeModel({ model: NANO_BANANA_MODEL_NAME });

    // --- 3. Construct the Multi-Modal Prompt ---
    // The final prompt sent to the API will be an array of "parts"
    const promptParts: Part[] = [
      { text: prompt },
    ];

    // If base images are provided, add them to the prompt parts
    if (baseImages && baseImages.length > 0) {
      baseImages.forEach(imgBase64 => {
        promptParts.push({
          inlineData: {
            mimeType: 'image/png', // Assuming PNG for now, can be made dynamic
            data: imgBase64,
          },
        });
      });
    }

    // --- 4. Call the Gemini API ---
    console.log("Sending request to Gemini API with prompt:", prompt);
    const result = await model.generateContent({
        contents: [{ role: 'user', parts: promptParts }]
    });

    // --- 5. Process the Response ---
    // The API returns an array of candidates, we'll take the first one.
    const firstCandidate = result.response.candidates?.[0];

    if (!firstCandidate || firstCandidate.content.parts.length === 0) {
        throw new Error("No content returned from the API.");
    }
    
    // Find the part that contains the generated image data
    const imagePart = firstCandidate.content.parts.find(part => part.inlineData);

    if (!imagePart || !imagePart.inlineData) {
        throw new Error("No image data found in the API response.");
    }

    const imageData = imagePart.inlineData.data;

    // --- 6. Send the Image Data Back to the Client ---
    // We send the raw base64 data, the client will prepend the data URI scheme.
    return NextResponse.json({ imageData: imageData });

  } catch (error) {
    console.error("Error in /api/generate:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return NextResponse.json(
      { error: "Failed to generate image.", details: errorMessage },
      { status: 500 }
    );
  }
}
