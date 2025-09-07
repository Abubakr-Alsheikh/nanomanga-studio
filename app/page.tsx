"use client";

import { useState } from "react";
import { StoryFoundation } from "@/components/story-foundation"; // New component
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AssetCreator } from "@/components/asset-creator";
import { AssetList } from "@/components/asset-list";
import { PageGenerator } from "@/components/page-generator";
import { MangaViewer } from "@/components/manga-viewer";
import { IAsset, IMangaPage, IStoryPlan } from "@/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";
import { toast } from "sonner";

export default function Home() {
  const [genre, setGenre] = useState("Sci-Fi");
  const [colorStyle, setColorStyle] = useState("Black and White");
  const [storySummary, setStorySummary] = useState("");
  const [artStyle, setArtStyle] = useState("");
  const [storyPlan, setStoryPlan] = useState<IStoryPlan | null>(null);

  const [characters, setCharacters] = useState<IAsset[]>([]);
  const [environments, setEnvironments] = useState<IAsset[]>([]);
  const [pages, setPages] = useState<IMangaPage[]>([]);

  const handleAssetCreated = (newAsset: IAsset) => {
    if (newAsset.type === "character") {
      setCharacters((prev) => [...prev, newAsset]);
    } else {
      setEnvironments((prev) => [...prev, newAsset]);
    }
  };

  const handlePageCreated = (newPage: IMangaPage) => {
    setPages((prev) =>
      [...prev, newPage].sort((a, b) => a.pageNumber - b.pageNumber)
    );
  };

  const handleStartOver = () => {
    setGenre("Sci-Fi");
    setColorStyle("Black and White");
    setStorySummary("");
    setArtStyle("");
    setStoryPlan(null);
    setCharacters([]);
    setEnvironments([]);
    setPages([]);
  };

  // --- NEW HANDLER: Remove the last page ---
  const handleRemoveLastPage = () => {
    setPages((prev) => prev.slice(0, -1));
    toast.success("Last page removed.");
  };

  // --- NEW HANDLER: Update a page after editing ---
  const handlePageUpdated = (
    pageId: string,
    updates: { imageUrl: string; prompt: string }
  ) => {
    setPages((prev) =>
      prev.map((page) => (page.id === pageId ? { ...page, ...updates } : page))
    );
    toast.success(
      `Page ${pages.find((p) => p.id === pageId)?.pageNumber} updated!`
    );
  };

  // Modify the main prompt sent to the image generator
  const finalArtStylePrompt = storyPlan ? storyPlan.detailedArtStyle : artStyle;

  return (
    <div className="flex flex-col gap-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">NanoManga Studio</h1>
        <p className="text-muted-foreground mt-2">
          Your AI co-creator for crafting unique manga stories.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 flex flex-col gap-8">
          <StoryFoundation
            genre={genre}
            setGenre={setGenre}
            colorStyle={colorStyle}
            setColorStyle={setColorStyle}
            storySummary={storySummary}
            setStorySummary={setStorySummary}
            artStyle={artStyle}
            setArtStyle={setArtStyle}
            storyPlan={storyPlan}
            setStoryPlan={setStoryPlan}
          />
          <Card>
            <CardHeader>
              <CardTitle>2. Create Assets</CardTitle>
              <CardDescription>
                Generate the characters and environments from your plan.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <AssetCreator
                artStyle={finalArtStylePrompt}
                onAssetCreated={handleAssetCreated}
                storyPlan={storyPlan}
                existingAssetNames={[...characters, ...environments].map(
                  (a) => a.name
                )}
                storySummary={storySummary} // Pass legacy summary for non-plan inspiration
              />
              <hr className="border-dashed" />
              <AssetList title="Characters" assets={characters} />
              <AssetList title="Environments" assets={environments} />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-8">
          <Card>
            <CardHeader>
              <CardTitle>3. Generate Pages</CardTitle>
              <CardDescription>
                Generate pages panel by panel using your story plan.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PageGenerator
                storySummary={
                  storyPlan ? storyPlan.detailedStorySummary : storySummary
                }
                artStyle={finalArtStylePrompt}
                characters={characters}
                environments={environments}
                pages={pages}
                onPageCreated={handlePageCreated}
                storyPlan={storyPlan}
                currentPageNumber={pages.length + 1}
              />
            </CardContent>
          </Card>
          <MangaViewer
            pages={pages}
            // --- Pass all new handlers down ---
            onStartOver={handleStartOver}
            onRemoveLastPage={handleRemoveLastPage}
            onPageUpdated={handlePageUpdated}
          />
        </div>
      </div>
    </div>
  );
}
