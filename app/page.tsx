"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StoryInput } from "@/components/story-input";
import { AssetCreator } from "@/components/asset-creator";
import { AssetList } from "@/components/asset-list";
import { PageGenerator } from "@/components/page-generator"; // Import
import { MangaViewer } from "@/components/manga-viewer"; // Import
import { IAsset, IMangaPage } from "@/types"; // Import IMangaPage

export default function Home() {
  const [storySummary, setStorySummary] = useState("");
  const [artStyle, setArtStyle] = useState("");
  const [characters, setCharacters] = useState<IAsset[]>([]);
  const [environments, setEnvironments] = useState<IAsset[]>([]);
  const [pages, setPages] = useState<IMangaPage[]>([]); // State for pages

  const handleAssetCreated = (newAsset: IAsset) => {
    if (newAsset.type === 'character') {
      setCharacters(prev => [...prev, newAsset]);
    } else {
      setEnvironments(prev => [...prev, newAsset]);
    }
  };

  const handlePageCreated = (newPage: IMangaPage) => {
    setPages(prev => [...prev, newPage].sort((a, b) => a.pageNumber - b.pageNumber));
  };

  return (
    <div className="flex flex-col gap-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">NanoManga Studio</h1>
        <p className="text-muted-foreground mt-2">
          Bring your manga stories to life with the power of AI.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Setup */}
        <div className="lg:col-span-1 flex flex-col gap-8">
          <StoryInput
            storySummary={storySummary}
            setStorySummary={setStorySummary}
            artStyle={artStyle}
            setArtStyle={setArtStyle}
          />
          <Card>
            <CardHeader>
              <CardTitle>2. Create Assets</CardTitle>
              <CardDescription>Generate the characters and environments for your story.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <AssetCreator artStyle={artStyle} onAssetCreated={handleAssetCreated} />
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
              <CardDescription>Write a prompt for a page, select assets to reference, and generate.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* === Integrate PageGenerator === */}
              <PageGenerator
                storySummary={storySummary}
                artStyle={artStyle}
                characters={characters}
                environments={environments}
                currentPageNumber={pages.length + 1}
                onPageCreated={handlePageCreated}
              />
            </CardContent>
          </Card>
          {/* === Integrate MangaViewer === */}
          <MangaViewer pages={pages} />
        </div>
      </div>
    </div>
  );
}
