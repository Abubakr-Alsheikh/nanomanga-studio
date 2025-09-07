import { IMangaPage } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

interface MangaViewerProps {
  pages: IMangaPage[];
}

export function MangaViewer({ pages }: MangaViewerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Manga</CardTitle>
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
              <div key={page.id} className="relative aspect-[3/4] group">
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
  );
}
