"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StoryInput } from "@/components/story-input";
import { AssetCreator } from "@/components/asset-creator"; // Import
import { AssetList } from "@/components/asset-list"; // Import
import { IAsset } from "@/types"; // Import our type

export default function Home() {
  const [storySummary, setStorySummary] = useState("");
  const [artStyle, setArtStyle] = useState("");
  
  // State for our generated assets
  const [characters, setCharacters] = useState<IAsset[]>([]);
  const [environments, setEnvironments] = useState<IAsset[]>([]);

  // Callback function to add a new asset to the correct list
  const handleAssetCreated = (newAsset: IAsset) => {
    if (newAsset.type === 'character') {
      setCharacters(prev => [...prev, newAsset]);
    } else {
      setEnvironments(prev => [...prev, newAsset]);
    }
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
              {/* === Integrate AssetCreator === */}
              <AssetCreator artStyle={artStyle} onAssetCreated={handleAssetCreated} />
              <hr className="border-dashed" />
              {/* === Integrate AssetLists === */}
              <AssetList title="Characters" assets={characters} />
              <AssetList title="Environments" assets={environments} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Generation & Viewer (remains the same for now) */}
        <div className="lg:col-span-2 flex flex-col gap-8">
           <Card>
            <CardHeader>
              <CardTitle>3. Generate Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Write a prompt for a page, select assets, and generate.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Your Manga</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
                 <p className="text-sm text-muted-foreground">Your generated pages will appear here.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
