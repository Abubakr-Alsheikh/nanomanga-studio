'use client';

import { useState } from "react"; // Import useState
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button"; // Import Button
import { Wand2, Loader2 } from "lucide-react"; // Import icons
import { toast } from "sonner"; // Import toast for feedback

interface StoryInputProps {
  storySummary: string;
  setStorySummary: (summary: string) => void;
  artStyle: string;
  setArtStyle: (style: string) => void;
}

export function StoryInput({
  storySummary,
  setStorySummary,
  artStyle,
  setArtStyle,
}: StoryInputProps) {
  // State to handle the loading of the inspiration feature
  const [isInspiring, setIsInspiring] = useState(false);

  const handleInspireMe = async () => {
    setIsInspiring(true);
    toast.info("Generating a story idea...");
    try {
      const response = await fetch('/api/inspire', { method: 'POST' });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Failed to get an idea.");
      }
      const { storySummary, artStyle } = await response.json();
      
      // Update the parent state with the new values
      setStorySummary(storySummary);
      setArtStyle(artStyle);

      toast.success("New story idea generated!");

    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Could not generate an idea.");
    } finally {
      setIsInspiring(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        {/* --- Updated CardHeader with Flex layout --- */}
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>1. Define Your Story</CardTitle>
            <CardDescription className="mt-1">
              Start with a summary and art style, or let AI inspire you.
            </CardDescription>
          </div>
          <Button variant="outline" size="icon" onClick={handleInspireMe} disabled={isInspiring}>
            {isInspiring ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="h-4 w-4" />
            )}
            <span className="sr-only">Inspire Me</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid w-full gap-1.5">
          <Label htmlFor="story-summary">Story Summary</Label>
          <Textarea
            id="story-summary"
            placeholder="e.g., A young ninja discovers a hidden power and must protect their village from a looming threat..."
            value={storySummary}
            onChange={(e) => setStorySummary(e.target.value)}
            className="min-h-32"
          />
        </div>
        <div className="grid w-full gap-1.5">
          <Label htmlFor="art-style">Art Style Instructions</Label>
          <Textarea
            id="art-style"
            placeholder="e.g., Black and white manga style, high contrast, dynamic action lines, shonen aesthetic, detailed backgrounds..."
            value={artStyle}
            onChange={(e) => setArtStyle(e.target.value)}
            className="min-h-24"
          />
        </div>
      </CardContent>
    </Card>
  );
}
