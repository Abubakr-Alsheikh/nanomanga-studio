'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Define the props the component will accept
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
  return (
    <Card>
      <CardHeader>
        <CardTitle>1. Define Your Story</CardTitle>
        <CardDescription>
          Start by giving your story a summary and describing the art style you want.
        </CardDescription>
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
