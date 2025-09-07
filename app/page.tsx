"use client"; // Make the page a client component to manage state

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StoryInput } from "@/components/story-input";

export default function Home() {
  // State management for the story definition
  const [storySummary, setStorySummary] = useState("");
  const [artStyle, setArtStyle] = useState("");

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
          {/* === Replace the placeholder with our component === */}
          <StoryInput
            storySummary={storySummary}
            setStorySummary={setStorySummary}
            artStyle={artStyle}
            setArtStyle={setArtStyle}
          />
          {/* ================================================= */}
          <Card>
            <CardHeader>
              <CardTitle>2. Create Assets</CardTitle>
            </CardHeader>
            <CardContent>
              {/* AssetCreator and AssetList Components will go here */}
              <p className="text-sm text-muted-foreground">
                Generate characters and environments.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Generation & Viewer */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <Card>
            <CardHeader>
              <CardTitle>3. Generate Pages</CardTitle>
            </CardHeader>
            <CardContent>
              {/* PageGenerator Component will go here */}
              <p className="text-sm text-muted-foreground">
                Write a prompt for a page, select assets, and generate.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Your Manga</CardTitle>
            </CardHeader>
            <CardContent>
              {/* MangaViewer Component will go here */}
              <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Your generated pages will appear here.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
