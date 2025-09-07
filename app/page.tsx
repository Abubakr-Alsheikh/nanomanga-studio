"use client";

import { useState } from "react";
// --- Imports for AlertDialog ---
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
import { Button } from "@/components/ui/button"; // Import Button
// --------------------------------

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StoryInput } from "@/components/story-input";
import { AssetCreator } from "@/components/asset-creator";
import { AssetList } from "@/components/asset-list";
import { PageGenerator } from "@/components/page-generator";
import { MangaViewer } from "@/components/manga-viewer";
import { IAsset, IMangaPage, IStoryPlan } from "@/types"; // Import IStoryPlan
import { RotateCw } from "lucide-react"; // Icon for the button
import { StoryPlanner } from "@/components/story-planner";

export default function Home() {
  const [storySummary, setStorySummary] = useState("");
  const [artStyle, setArtStyle] = useState("");
  const [characters, setCharacters] = useState<IAsset[]>([]);
  const [environments, setEnvironments] = useState<IAsset[]>([]);
  const [pages, setPages] = useState<IMangaPage[]>([]);
  const [storyPlan, setStoryPlan] = useState<IStoryPlan | null>(null); // Add state for the plan

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

  // --- New function to reset all state ---
  const handleStartOver = () => {
    setStorySummary("");
    setArtStyle("");
    setCharacters([]);
    setEnvironments([]);
    setPages([]);
    setStoryPlan(null);
  };
  // --------------------------------------

  return (
    <div className="flex flex-col gap-8">
      {/* === Updated Header === */}
      <header className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-4xl font-bold tracking-tight">
            NanoManga Studio
          </h1>
          <p className="text-muted-foreground mt-2">
            Bring your manga stories to life with the power of AI.
          </p>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline">
              <RotateCw className="mr-2 h-4 w-4" />
              Start Over
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                current story, assets, and generated pages.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleStartOver}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </header>
      {/* ======================= */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Setup */}
        <div className="lg:col-span-1 flex flex-col gap-8">
          <StoryInput
            storySummary={storySummary}
            setStorySummary={setStorySummary}
            artStyle={artStyle}
            setArtStyle={setArtStyle}
          />

          {/* === ADD THE NEW STORY PLANNER COMPONENT HERE === */}
          <StoryPlanner
            storySummary={storySummary}
            storyPlan={storyPlan} // Pass state down
            setStoryPlan={setStoryPlan} // Pass setter down
          />
          {/* ================================================ */}

          <Card>
            <CardHeader>
              <CardTitle>2. Create Assets</CardTitle>
              <CardDescription>
                Use the plan above to generate characters and environments.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <AssetCreator
                artStyle={artStyle}
                onAssetCreated={handleAssetCreated}
                // Pass additional props
                storySummary={storySummary}
                existingAssetNames={[...characters, ...environments].map(
                  (a) => a.name
                )}
                storyPlan={storyPlan} // Pass state down
              />
              <hr className="border-dashed" />
              <AssetList title="Characters" assets={characters} />
              <AssetList title="Environments" assets={environments} />
            </CardContent>
          </Card>
        </div>
        {/* Right Column: Generation & Viewer */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <Card>
            <CardHeader>
              <CardTitle>3. Generate Pages</CardTitle>
              <CardDescription>
                Write a prompt for a page, select assets to reference, and
                generate.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PageGenerator
                storySummary={storySummary}
                artStyle={artStyle}
                characters={characters}
                environments={environments}
                currentPageNumber={pages.length + 1}
                onPageCreated={handlePageCreated}
                pages={pages} // Pass pages for context
                storyPlan={storyPlan} // Pass state down
              />
            </CardContent>
          </Card>
          <MangaViewer pages={pages} />
        </div>
      </div>
    </div>
  );
}
