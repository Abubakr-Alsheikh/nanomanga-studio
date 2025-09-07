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
import { Loader2, BookCheck, Wand2, ChevronsUpDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { EditableTruncatedText } from "./editable-truncated-text";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Props interface remains the same
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

const initialGenres = [
  "Sci-Fi",
  "Fantasy",
  "Slice of Life",
  "Action",
  "Horror",
  "Cyberpunk",
  "Romance",
];
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
  const [genreOptions, setGenreOptions] = useState(initialGenres);

  const handleInspire = async () => {
    setIsInspiring(true);
    toast.info("Dreaming up a new story...");
    try {
      const response = await fetch("/api/inspire/foundation", {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to get inspiration.");
      const data = await response.json();

      // Dynamically add new genre to options if it doesn't exist
      if (!genreOptions.includes(data.genre)) {
        setGenreOptions((prev) => [...prev, data.genre]);
      }

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

  // Handlers for editing the plan directly
  const handlePlanChange = (field: keyof IStoryPlan, value: any) => {
    setStoryPlan((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handlePlanListItemChange = (
    list: "characters" | "environments" | "pages",
    index: number,
    field: string,
    value: string | number
  ) => {
    setStoryPlan((prev) => {
      if (!prev) return null;
      const newList = [...prev[list]];
      newList[index] = { ...newList[index], [field]: value };
      return { ...prev, [list]: newList };
    });
  };

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>1. Story Foundation</CardTitle>
            <CardDescription className="mt-1">
              Define your idea, or let AI inspire you, then generate a detailed
              plan.
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleInspire}
            disabled={isInspiring || isPlanning}
            title="Inspire Me"
          >
            {isInspiring ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* --- CORRECTED CONDITIONAL RENDERING --- */}
        {!storyPlan && !isPlanning && (
          <div className="space-y-6">
            <div className="space-y-4 p-4 border rounded-lg">
              <div className="space-y-1.5">
                <Label>Genre</Label>
                <Select value={genre} onValueChange={setGenre}>
                  <SelectTrigger>
                    <SelectValue placeholder="Genre" />
                  </SelectTrigger>
                  <SelectContent>
                    {genreOptions.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Color Style</Label>
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
              <div className="space-y-1.5">
                <Label htmlFor="story-summary">Story Summary</Label>
                <Textarea
                  id="story-summary"
                  placeholder="A brief, one-paragraph summary..."
                  value={storySummary}
                  onChange={(e) => setStorySummary(e.target.value)}
                  className="h-30"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="art-style">Art Style</Label>
                <Textarea
                  id="art-style"
                  placeholder="Describe the visual style..."
                  value={artStyle}
                  onChange={(e) => setArtStyle(e.target.value)}
                  className="h-30"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Select
                value={String(numPages)}
                onValueChange={(v) => setNumPages(Number(v))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[3, 4, 6, 8, 10, 12, 15].map((p) => (
                    <SelectItem key={p} value={String(p)}>
                      {p} Pages
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleMakePlan}
                disabled={!storySummary}
                className="w-full"
                size="lg"
              >
                <BookCheck className="mr-2 h-4 w-4" /> Make Plan
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {isPlanning && <PlanSkeleton />}
          {storyPlan && (
            <div className="space-y-4 p-4 bg-muted rounded-lg border">
              <EditableTruncatedText
                label="Story Details"
                value={storyPlan.detailedStorySummary}
                onChange={(v) => handlePlanChange("detailedStorySummary", v)}
              />
              <EditableTruncatedText
                label="Art Style Details"
                value={storyPlan.detailedArtStyle}
                onChange={(v) => handlePlanChange("detailedArtStyle", v)}
              />

              <Collapsible defaultOpen>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full flex justify-between items-center px-2"
                  >
                    <h4 className="font-semibold">
                      Characters ({storyPlan.characters.length})
                    </h4>
                    <ChevronsUpDown className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 p-2">
                  {storyPlan.characters.map((char, i) => (
                    <div
                      key={i}
                      className="space-y-1.5 p-2 border bg-background rounded"
                    >
                      <Input
                        value={char.name}
                        onChange={(e) =>
                          handlePlanListItemChange(
                            "characters",
                            i,
                            "name",
                            e.target.value
                          )
                        }
                        placeholder="Character Name"
                      />
                      <Textarea
                        value={char.description}
                        onChange={(e) =>
                          handlePlanListItemChange(
                            "characters",
                            i,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Character Description"
                        className="text-xs"
                      />
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full flex justify-between items-center px-2"
                  >
                    <h4 className="font-semibold">
                      Environments ({storyPlan.environments.length})
                    </h4>
                    <ChevronsUpDown className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 p-2">
                  {storyPlan.environments.map((env, i) => (
                    <div
                      key={i}
                      className="space-y-1.5 p-2 border bg-background rounded"
                    >
                      <Input
                        value={env.name}
                        onChange={(e) =>
                          handlePlanListItemChange(
                            "environments",
                            i,
                            "name",
                            e.target.value
                          )
                        }
                        placeholder="Environment Name"
                      />
                      <Textarea
                        value={env.description}
                        onChange={(e) =>
                          handlePlanListItemChange(
                            "environments",
                            i,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Environment Description"
                        className="text-xs"
                      />
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full flex justify-between items-center px-2"
                  >
                    <h4 className="font-semibold">
                      Page Breakdown ({storyPlan.pages.length})
                    </h4>
                    <ChevronsUpDown className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 p-2">
                  {storyPlan.pages.map((page, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 p-2 border bg-background rounded"
                    >
                      <b className="pt-2 text-sm">{page.page}.</b>
                      <Textarea
                        value={page.description}
                        onChange={(e) =>
                          handlePlanListItemChange(
                            "pages",
                            i,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Page Description"
                        className="text-xs"
                      />
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
