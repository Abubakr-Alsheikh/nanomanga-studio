"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { IStoryPlan } from "@/types";
import { toast } from "sonner";
import { Loader2, BookCheck, Wand2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface StoryFoundationProps {
  genre: string;
  setGenre: (g: string) => void;
  colorStyle: string;
  setColorStyle: (c: string) => void;
  storySummary: string;
  setStorySummary: (s: string) => void;
  artStyle: string;
  setArtStyle: (a: string) => void;
  storyPlan: IStoryPlan | null;
  setStoryPlan: (plan: IStoryPlan | null) => void;
}

const genres = [
  "Sci-Fi",
  "Fantasy",
  "Slice of Life",
  "Action",
  "Horror",
  "Cyberpunk",
  "Romance",
];

export function StoryFoundation({
  genre,
  setGenre,
  colorStyle,
  setColorStyle,
  storySummary,
  setStorySummary,
  artStyle,
  setArtStyle,
  storyPlan,
  setStoryPlan,
}: StoryFoundationProps) {
  const [numPages, setNumPages] = useState<number>(4);
  const [isInspiring, setIsInspiring] = useState(false);
  const [isPlanning, setIsPlanning] = useState(false);

  const handleInspire = async () => {
    setIsInspiring(true);
    toast.info("Dreaming up a new story...");
    try {
      const response = await fetch("/api/inspire/foundation", {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to get inspiration.");
      const data = await response.json();
      setGenre(data.genre);
      setStorySummary(data.storySummary);
      setArtStyle(data.artStyle);
      setColorStyle(data.colorStyle);
      toast.success("Inspiration struck!");
    } catch (error) {
      toast.error("Inspiration failed.");
    } finally {
      setIsInspiring(false);
    }
  };

  const handleMakePlan = async () => {
    if (!storySummary.trim()) {
      toast.error("Please provide a story summary first.");
      return;
    }
    setIsPlanning(true);
    setStoryPlan(null);
    toast.info("Crafting a detailed story plan...");
    try {
      const response = await fetch("/api/inspire/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          genre,
          storySummary,
          artStyle,
          colorStyle,
          numPages,
        }),
      });
      if (!response.ok) throw new Error("Failed to generate plan.");
      const plan: IStoryPlan = await response.json();
      setStoryPlan(plan);
      toast.success("Story plan is ready!");
    } catch (error) {
      toast.error("Planning failed.");
    } finally {
      setIsPlanning(false);
    }
  };

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>1. Story Foundation</CardTitle>
        <CardDescription>
          Define your core idea, or let AI inspire you, then generate a detailed
          plan.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Inputs */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select value={genre} onValueChange={setGenre}>
              <SelectTrigger>
                <SelectValue placeholder="Genre" />
              </SelectTrigger>
              <SelectContent>
                {genres.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={colorStyle} onValueChange={setColorStyle}>
              <SelectTrigger>
                <SelectValue placeholder="Color Style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Black and White">B&W</SelectItem>
                <SelectItem value="Colorized">Color</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="story-summary">Story Summary</Label>
            <Textarea
              id="story-summary"
              placeholder="A brief, one-paragraph summary of your story..."
              value={storySummary}
              onChange={(e) => setStorySummary(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="art-style">Art Style</Label>
            <Textarea
              id="art-style"
              placeholder="Describe the visual style..."
              value={artStyle}
              onChange={(e) => setArtStyle(e.target.value)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleInspire}
            disabled={isInspiring || isPlanning}
            className="w-full"
          >
            {isInspiring ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}{" "}
            Inspire Me
          </Button>
          <Select
            value={String(numPages)}
            onValueChange={(v) => setNumPages(Number(v))}
            disabled={isInspiring || isPlanning}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[3, 4, 6, 8, 10, 12, 15].map((p) => (
                <SelectItem key={p} value={String(p)}>
                  {p} pgs
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={handleMakePlan}
          disabled={isInspiring || isPlanning || !storySummary}
          className="w-full"
          size="lg"
        >
          {isPlanning ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <BookCheck className="mr-2 h-4 w-4" />
          )}{" "}
          Make Plan
        </Button>

        {/* Plan Display */}
        <div className="pt-4 space-y-4">
          {isPlanning && <PlanSkeleton />}
          {storyPlan && (
            <div className="space-y-4 text-sm p-4 bg-muted rounded-lg">
              <div>
                <h4 className="font-semibold">Story Details</h4>
                <p className="text-muted-foreground">
                  {storyPlan.detailedStorySummary}
                </p>
              </div>
              <div>
                <h4 className="font-semibold">Art Style Details</h4>
                <p className="text-muted-foreground">
                  {storyPlan.detailedArtStyle}
                </p>
              </div>
              {/* other plan details */}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

const PlanSkeleton = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-4 w-full" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
    </div>
  </div>
);
