"use client";

import { useState } from "react";
import { IMangaPage } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  RotateCw,
  Trash2,
  Pencil,
  Loader2,
  Download,
  ExternalLink,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

interface MangaViewerProps {
  pages: IMangaPage[];
  onStartOver: () => void;
  onRemoveLastPage: () => void;
  onPageUpdated: (
    pageId: string,
    updates: { imageUrl: string; prompt: string }
  ) => void;
}

export function MangaViewer({
  pages,
  onStartOver,
  onRemoveLastPage,
  onPageUpdated,
}: MangaViewerProps) {
  const [openPage, setOpenPage] = useState<IMangaPage | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState("");
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleOpenDialog = (page: IMangaPage) => {
    setOpenPage(page);
    setEditedPrompt(page.prompt);
    setIsEditing(false); // Reset edit state on open
  };

  const handleCloseDialog = () => {
    setOpenPage(null);
  };

  const handleRegenerate = async () => {
    if (!openPage || !editedPrompt.trim()) return;

    setIsRegenerating(true);
    toast.info(`Regenerating page ${openPage.pageNumber}...`);

    try {
      // Find all pages before the one being edited
      const previousPages = pages.slice(0, openPage.pageNumber - 1);

      const fullPrompt = `
        **Manga Page EDIT**
        **Task:** Re-draw the provided 'Image to Edit' using the new, updated prompt. Maintain the overall art style and continuity from the 'Previous Page Context' images.
        **UPDATED PROMPT:** ${editedPrompt}
      `;

      // The image to edit becomes the last one in the context array
      const baseImages = [
        ...previousPages.map((p) => p.imageUrl.split(",")[1]),
        openPage.imageUrl.split(",")[1],
      ];

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: fullPrompt, baseImages }),
      });

      if (!response.ok) throw new Error("Failed to regenerate image.");

      const { imageData } = await response.json();
      const newImageUrl = `data:image/png;base64,${imageData}`;

      // Call the parent handler to update the state
      onPageUpdated(openPage.id, {
        imageUrl: newImageUrl,
        prompt: editedPrompt,
      });

      // Update the view in the dialog as well
      setOpenPage((prev) =>
        prev ? { ...prev, imageUrl: newImageUrl, prompt: editedPrompt } : null
      );
      setIsEditing(false);
    } catch (error) {
      toast.error("Regeneration failed.");
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleDownload = () => {
    if (!openPage) return;

    // Create a temporary anchor element
    const link = document.createElement("a");
    link.href = openPage.imageUrl;
    link.download = `nanomanga-page-${openPage.pageNumber}.png`;

    // Programmatically click the link to trigger the download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Your Manga</CardTitle>
            <CardDescription>
              Click a page to view, edit, or regenerate it.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {pages.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="icon"
                    title="Remove Last Page"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove Last Page?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete page {pages.length}.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onRemoveLastPage}>
                      Remove
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="icon" title="Start Over">
                  <RotateCw className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will clear your entire project.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onStartOver}>
                    Start Over
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardHeader>
        <CardContent>
          {pages.length === 0 ? (
            <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
              <p className="text-sm text-muted-foreground">
                Your generated pages will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pages.map((page) => (
                <div
                  key={page.id}
                  className="relative aspect-[3/4] group cursor-pointer"
                  onClick={() => handleOpenDialog(page)}
                >
                  <Image
                    src={page.imageUrl}
                    alt={`Manga Page ${page.pageNumber}`}
                    fill
                    className="rounded-md object-cover border"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded">
                    {page.pageNumber}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={!!openPage}
        onOpenChange={(isOpen) => !isOpen && handleCloseDialog()}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col md:flex-row gap-6">
          <div className="flex-1 relative aspect-[3/4]">
            {openPage && (
              <Image
                src={openPage.imageUrl}
                alt={`Manga Page ${openPage.pageNumber}`}
                fill
                className="rounded-md object-contain"
              />
            )}
          </div>
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <DialogHeader>
                <DialogTitle>Page {openPage?.pageNumber}</DialogTitle>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <Label htmlFor="prompt-viewer">Page Prompt</Label>
                {isEditing ? (
                  <Textarea
                    id="prompt-viewer"
                    value={editedPrompt}
                    onChange={(e) => setEditedPrompt(e.target.value)}
                    className="h-48 text-sm"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground p-3 bg-muted rounded-md h-48 overflow-y-auto">
                    {openPage?.prompt}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter className="flex-col md:flex-row gap-2">
              <Button
                variant="secondary"
                onClick={() => window.open(openPage?.imageUrl, "_blank")}
                disabled={isRegenerating}
              >
                <ExternalLink className="mr-2 h-4 w-4" /> View Full
              </Button>
              <Button
                variant="secondary"
                onClick={handleDownload}
                disabled={isRegenerating}
              >
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
              <div className="flex-grow" /> {/* Spacer */}
              <Button
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
                disabled={isRegenerating}
              >
                <Pencil className="mr-2 h-4 w-4" />{" "}
                {isEditing ? "Cancel" : "Edit"}
              </Button>
              {isEditing && (
                <Button onClick={handleRegenerate} disabled={isRegenerating}>
                  {isRegenerating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}{" "}
                  Regenerate
                </Button>
              )}
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
