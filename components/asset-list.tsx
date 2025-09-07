import { IAsset } from "@/types";
import Image from "next/image";

interface AssetListProps {
  title: string;
  assets: IAsset[];
}

export function AssetList({ title, assets }: AssetListProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">{title}</h3>
      {assets.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No {title.toLowerCase()} created yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-4">
          {assets.map((asset) => (
            <div key={asset.id} className="relative aspect-square group">
              <Image
                src={asset.imageUrl}
                alt={asset.name}
                fill
                className="rounded-md object-cover border"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-white text-xs rounded-b-md">
                <p className="font-bold truncate">{asset.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
