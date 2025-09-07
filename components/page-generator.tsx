"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IAsset, IMangaPage, IStoryPlan } from "@/types";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { InspireButton } from "./inspire-button";

interface PageGeneratorProps {
  storySummary: string;
  artStyle: string;
  characters: IAsset[];
  environments: IAsset[];
  pages: IMangaPage[];
  currentPageNumber: number;
  onPageCreated: (page: IMangaPage) => void;
  storyPlan: IStoryPlan | null;
}

export function PageGenerator({
  storySummary,
  artStyle,
  characters,
  environments,
  pages,
  currentPageNumber,
  onPageCreated,
  storyPlan,
}: PageGeneratorProps) {
  const [pagePrompt, setPagePrompt] = useState("");
  const [selectedAssetIds, setSelectedAssetIds] = useState<Set<string>>(
    new Set()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isInspiring, setIsInspiring] = useState(false);

  const handleInspire = async () => {
    if (!storyPlan) {
      toast.error("Please generate a story plan first for smart suggestions.");
      return;
    }
    setIsInspiring(true);
    toast.info("Generating a suggestion for the next page...");
    try {
      const response = await fetch("/api/inspire/page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storySummary,
          characterNames: characters.map((c) => c.name),
          environmentNames: environments.map((e) => e.name),
          storyPlanPages: storyPlan.pages, // Send the page breakdown
          previousPagePrompts: pages.map((p) => p.prompt),
        }),
      });
      if (!response.ok) throw new Error("Failed to get suggestion.");
      const { pagePrompt: newPrompt } = await response.json();
      setPagePrompt(newPrompt);
      toast.success("Page suggestion generated!");
    } catch (error) {
      toast.error("Could not generate a suggestion.");
    } finally {
      setIsInspiring(false);
    }
  };

  const handleAssetSelection = (assetId: string) => {
    setSelectedAssetIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(assetId)) {
        newSet.delete(assetId);
      } else {
        newSet.add(assetId);
      }
      return newSet;
    });
  };

  const handleGeneratePage = async () => {
    if (!pagePrompt.trim()) {
      toast.error("Please provide a prompt for the page.");
      return;
    }
    if (!storySummary.trim() || !artStyle.trim()) {
      toast.warning(
        "For best results, please define your story and art style first."
      );
    }

    setIsLoading(true);
    toast.info(
      `Generating page ${currentPageNumber}... This may take a moment.`
    );

    try {
      // 1. Find the full asset objects for the selected IDs
      const allAssets = [...characters, ...environments];
      const selectedAssets = allAssets.filter((asset) =>
        selectedAssetIds.has(asset.id)
      );

      // 2. Construct the detailed text prompt
      const characterNames =
        selectedAssets
          .filter((a) => a.type === "character")
          .map((c) => c.name)
          .join(", ") || "none";
      const environmentNames =
        selectedAssets
          .filter((a) => a.type === "environment")
          .map((e) => e.name)
          .join(", ") || "none";

      const fullPrompt = `
        **Manga Page Generation**
        **Story Summary:** ${storySummary}
        **Art Style:** ${artStyle}
        **Page Number:** ${currentPageNumber}
        **Page Description:** ${pagePrompt}
        
        **Assets to include:**
        - Characters: ${characterNames}
        - Environments: ${environmentNames}

        **Instructions:** Create a single manga page based on the description. Use the provided images as a strong visual reference for the characters and environments to maintain consistency.
      `.trim();

      // 3. Extract base64 data from selected asset image URLs
      const baseImages = selectedAssets.map((asset) => {
        // The URL is in the format "data:image/png;base64,ENCODED_DATA"
        // We need to extract just the ENCODED_DATA part.
        return asset.imageUrl.split(",")[1];
      });

      // 4. Call the API
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: fullPrompt, baseImages }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Failed to generate page.");
      }

      const { imageData } = await response.json();
      const newPage: IMangaPage = {
        id: crypto.randomUUID(),
        pageNumber: currentPageNumber,
        prompt: pagePrompt,
        imageUrl: `data:image/png;base64,${imageData}`,
      };

      onPageCreated(newPage);
      toast.success(`Page ${currentPageNumber} generated successfully!`);
      setPagePrompt(""); // Clear prompt for the next page
      setSelectedAssetIds(new Set()); // Clear selections
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "An unknown error occurred."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const hasAssets = characters.length > 0 || environments.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between">
          <Label htmlFor="page-prompt" className="text-lg font-semibold">
            Page {currentPageNumber} Prompt
          </Label>
          <InspireButton onClick={handleInspire} isLoading={isInspiring} />
        </div>
        <Textarea
          id="page-prompt"
          placeholder="e.g., Kenji stands defiantly in the Neo-Kyoto Market, facing off against a shadowy figure. Rain pours down."
          className="min-h-32 mt-2"
          value={pagePrompt}
          onChange={(e) => setPagePrompt(e.target.value)}
          disabled={isLoading}
        />
      </div>

      {/* === Updated Asset Selection Area === */}
      <div className="space-y-4">
        <h4 className="font-semibold">Select Assets to Include</h4>
        {!hasAssets ? (
          <p className="text-sm text-muted-foreground p-4 text-center bg-muted rounded-md">
            Go to "2. Create Assets" to generate characters and environments
            first.
          </p>
        ) : (
          <>
            {characters.length > 0 && (
              <div className="space-y-2">
                <Label>Characters</Label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                  {characters.map((char) => (
                    <div
                      key={char.id}
                      className="flex flex-col items-center gap-2"
                    >
                      <label
                        htmlFor={char.id}
                        className="cursor-pointer relative"
                      >
                        <Image
                          src={char.imageUrl}
                          alt={char.name}
                          width={80}
                          height={80}
                          className="rounded-md object-cover aspect-square border"
                        />
                        <Checkbox
                          id={char.id}
                          onCheckedChange={() => handleAssetSelection(char.id)}
                          checked={selectedAssetIds.has(char.id)}
                          className="absolute top-1 right-1 bg-background"
                          disabled={isLoading}
                        />
                      </label>
                      <span className="text-xs text-center">{char.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {environments.length > 0 && (
              <div className="space-y-2">
                <Label>Environments</Label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                  {environments.map((env) => (
                    <div
                      key={env.id}
                      className="flex flex-col items-center gap-2"
                    >
                      <label
                        htmlFor={env.id}
                        className="cursor-pointer relative"
                      >
                        <Image
                          src={env.imageUrl}
                          alt={env.name}
                          width={80}
                          height={80}
                          className="rounded-md object-cover aspect-square border"
                        />
                        <Checkbox
                          id={env.id}
                          onCheckedChange={() => handleAssetSelection(env.id)}
                          checked={selectedAssetIds.has(env.id)}
                          className="absolute top-1 right-1 bg-background"
                          disabled={isLoading}
                        />
                      </label>
                      <span className="text-xs text-center">{env.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      {/* ================================== */}

      <Button
        onClick={handleGeneratePage}
        disabled={isLoading || !hasAssets}
        size="lg"
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating Page...
          </>
        ) : (
          `Generate Page ${currentPageNumber}`
        )}
      </Button>
    </div>
  );
}
