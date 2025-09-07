'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { IAsset } from "@/types";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { InspireButton } from "./inspire-button"; // Import our new component

interface AssetCreatorProps {
  artStyle: string;
  storySummary: string; // Add storySummary
  existingAssetNames: string[]; // Add existing names
  onAssetCreated: (asset: IAsset) => void;
}

export function AssetCreator({ artStyle, storySummary, existingAssetNames, onAssetCreated }: AssetCreatorProps) {
  const [assetType, setAssetType] = useState<"character" | "environment">("character");
  const [name, setName] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInspiring, setIsInspiring] = useState(false);

  const handleInspire = async () => {
    if (!storySummary) {
      toast.error("Please define a story summary first for better suggestions.");
      return;
    }
    setIsInspiring(true);
    toast.info(`Getting an idea for a new ${assetType}...`);
    try {
      const response = await fetch('/api/inspire/asset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assetType, storySummary, existingAssetNames }),
      });
      if (!response.ok) throw new Error("Failed to get suggestion.");
      const { name: newName, prompt: newPrompt } = await response.json();
      setName(newName);
      setPrompt(newPrompt);
      toast.success("New idea generated!");
    } catch (error) {
      toast.error("Could not generate an idea.");
    } finally {
      setIsInspiring(false);
    }
  };

  const handleGenerate = async () => {
    if (!name.trim() || !prompt.trim()) {
      toast.error("Please provide a name and a prompt.");
      return;
    }

    setIsLoading(true);
    toast.info(`Generating ${assetType}: ${name}...`);

    // **Crucial Step**: Combine the specific prompt with the overall art style
    const fullPrompt = `A ${assetType} named '${name}'. Description: ${prompt}. Art Style: ${artStyle || 'manga style'}`;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Failed to generate asset.");
      }

      const { imageData } = await response.json();
      const newAsset: IAsset = {
        id: crypto.randomUUID(),
        name,
        type: assetType,
        prompt: fullPrompt,
        imageUrl: `data:image/png;base64,${imageData}`,
      };
      
      onAssetCreated(newAsset);
      toast.success(`${assetType} '${name}' created successfully!`);

      // Reset form
      setName("");
      setPrompt("");

    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const placeholderText = assetType === 'character' 
    ? "e.g., A stoic samurai with a scar over his left eye, wearing traditional dark blue robes."
    : "e.g., A bustling futuristic city market at night, neon signs reflecting in puddles on the street.";

  return (
    <div className="space-y-4">
      <Tabs value={assetType} onValueChange={(v) => setAssetType(v as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="character">Character</TabsTrigger>
          <TabsTrigger value="environment">Environment</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="asset-name">Name</Label>
          <InspireButton onClick={handleInspire} isLoading={isInspiring} />
        </div>
        <Input 
          id="asset-name" 
          placeholder={assetType === 'character' ? "e.g., Kenji" : "e.g., Neo-Kyoto Market"}
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="asset-prompt">Prompt</Label>
        <Textarea 
          id="asset-prompt" 
          placeholder={placeholderText}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isLoading}
          className="min-h-28"
        />
      </div>
      
      <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          `Generate ${assetType}`
        )}
      </Button>
    </div>
  );
}
