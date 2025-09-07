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
import { Loader2, BookCheck } from "lucide-react";
import { InspireButton } from "./inspire-button";
import { Skeleton } from "@/components/ui/skeleton";

interface StoryPlannerProps {
  storySummary: string;
  storyPlan: IStoryPlan | null; // Receive from props
  setStoryPlan: (plan: IStoryPlan | null) => void; // Receive from props
}

export function StoryPlanner({
  storySummary,
  storyPlan,
  setStoryPlan,
}: StoryPlannerProps) {
  const [numPages, setNumPages] = useState<number>(4);
  const [isLoading, setIsLoading] = useState(false);

  const handleGeneratePlan = async () => {
    if (!storySummary.trim()) {
      toast.error("Please define your story summary first.");
      return;
    }
    setIsLoading(true);
    setStoryPlan(null); // Clear previous plan
    toast.info("Generating a detailed story plan...");

    try {
      const response = await fetch("/api/inspire/story-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storySummary, numPages }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate plan from the server.");
      }
      const plan: IStoryPlan = await response.json();
      setStoryPlan(plan);
      toast.success("Story plan generated successfully!");
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "An unknown error occurred."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>1.5 Plan Your Story</CardTitle>
        <CardDescription>
          Let AI break down your idea into characters, environments, and a
          page-by-page plot.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Select
            value={String(numPages)}
            onValueChange={(val) => setNumPages(Number(val))}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select page count" />
            </SelectTrigger>
            <SelectContent>
              {[3, 4, 5, 6, 8].map((p) => (
                <SelectItem key={p} value={String(p)}>
                  {p} Pages
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleGeneratePlan}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <BookCheck className="mr-2 h-4 w-4" />
            )}
            Generate Plan
          </Button>
        </div>

        {/* Display Area */}
        <div className="pt-4 space-y-4">
          {isLoading && <PlanSkeleton />}
          {storyPlan && (
            <div className="space-y-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Suggested Characters</h4>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  {storyPlan.characters.map((c) => (
                    <li key={c.name}>
                      <b>{c.name}:</b> {c.description}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Suggested Environments</h4>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  {storyPlan.environments.map((e) => (
                    <li key={e.name}>
                      <b>{e.name}:</b> {e.description}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Page Breakdown</h4>
                <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
                  {storyPlan.pages.map((p) => (
                    <li key={p.page}>
                      <b>Page {p.page}:</b> {p.description}
                    </li>
                  ))}
                </ol>
              </div>
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
