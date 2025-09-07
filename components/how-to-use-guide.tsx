// file: app/components/how-to-use-guide.tsx

"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

export function HowToUseGuide() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <BookOpen className="mr-2 h-4 w-4" />
          How to Use
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>How to Use NanoManga Studio</DialogTitle>
          <DialogDescription>
            Follow these steps to create your own AI-powered manga.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 text-sm">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">
                Step 1: Story Foundation
              </h3>
              <p>This is where your idea begins. You have two options:</p>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>
                  <strong>Fill it out yourself:</strong> Choose a genre, color
                  style, and write your own story summary and art style
                  description.
                </li>
                <li>
                  <strong>Let AI help:</strong> Click the{" "}
                  <strong className="text-primary">Inspire Me</strong> (✨)
                  button to have the AI generate a unique, fun idea and fill in
                  all the fields for you.
                </li>
              </ul>
              <p>
                Once you have an idea you like, select the number of pages and
                click <strong className="text-primary">Make Plan</strong>. The
                AI will expand your idea into a detailed, editable plan with
                character descriptions, environments, and a page-by-page plot.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Step 2: Create Assets</h3>
              <p>Bring your story's cast and world to life.</p>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>
                  The <strong className="text-primary">Inspire Me</strong> (✨)
                  button here is context-aware! It will look at your story plan
                  and suggest the next un-created character or environment,
                  generating a professional prompt for it.
                </li>
                <li>
                  Click <strong className="text-primary">Generate</strong> to
                  create the asset. The AI will use your detailed art style to
                  ensure consistency.
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Step 3: Generate Pages</h3>
              <p>This is where you create the manga itself.</p>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>
                  The <strong className="text-primary">Inspire Me</strong> (✨)
                  button here is incredibly smart. It reads your story plan and
                  the content of previous pages to write a detailed,
                  panel-by-panel prompt for the very next page, ensuring the
                  story flows logically.
                </li>
                <li>
                  Select the characters and environments that appear on this
                  page. Then click{" "}
                  <strong className="text-primary">Generate Page</strong>.
                </li>
                <li>
                  The AI uses all available information—previous pages, asset
                  references, and your prompt—to create a visually consistent
                  new page.
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">
                Step 4: View & Edit Your Manga
              </h3>
              <p>
                Your generated pages will appear in the "Your Manga" viewer.
                This is your interactive canvas.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>
                  <strong>Click any page</strong> to open a detailed view.
                </li>
                <li>
                  Here you can{" "}
                  <strong className="text-primary">View Full</strong> image,{" "}
                  <strong className="text-primary">Download</strong> it, or{" "}
                  <strong className="text-primary">Edit Prompt</strong>.
                </li>
                <li>
                  Editing and clicking{" "}
                  <strong className="text-primary">Regenerate</strong> will
                  re-create the page using your new instructions while
                  maintaining continuity with previous pages.
                </li>
                <li>
                  Use the header buttons to{" "}
                  <strong className="text-destructive">
                    Remove the Last Page
                  </strong>{" "}
                  or <strong className="text-primary">Start Over</strong>{" "}
                  completely.
                </li>
              </ul>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
