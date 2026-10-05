import Image from "next/image";
import { getRegistry } from "@/lib/content/load";
import type { PhotoRef } from "@/lib/content/schema";

/** Aspect ratios per breakpoint class; the frame reserves space so photographs never shift layout. */
const RATIOS = {
  rail: { sm: "4 / 3", md: "16 / 10", lg: "1 / 1", sizes: "(min-width: 64rem) 30vw, 100vw" },
  band: { sm: "4 / 3", md: "16 / 9", lg: "21 / 9", sizes: "(min-width: 80rem) 76rem, 100vw" },
  split: { sm: "4 / 3", md: "16 / 10", lg: "3 / 2", sizes: "(min-width: 64rem) 58vw, 100vw" },
  aside: { sm: "16 / 10", lg: "16 / 10", sizes: "(min-width: 64rem) 36vw, 100vw" },
} as const;

/**
 * A registered photograph. Alt text, dimensions and the creator credit come from the asset
 * registry (data/assets/images.yaml), so a photograph cannot be shown without provenance.
 * Framing is CSS only; the stored file is never cropped.
 */
export function Photo({ photo, className = "" }: { photo: PhotoRef; className?: string }) {
  const asset = getRegistry().assets.find((a) => a.id === photo.asset);
  if (!asset || !asset.width || !asset.height) throw new Error(`Unknown photograph ${photo.asset}`);
  const r = RATIOS[photo.layout];
  const creator = asset.creator.replace(/ \(.*\)$/, "");
  const src = `/${asset.file.replace(/^public\//, "")}`;
  const style = {
    "--ar-sm": r.sm,
    "--ar-md": "md" in r ? r.md : r.sm,
    "--ar-lg": r.lg,
  } as React.CSSProperties;
  return (
    <figure className={`photo ${className}`.trim()} data-reveal="image">
      <div className="photo-frame" style={style}>
        <Image
          src={src}
          alt={asset.alt}
          width={asset.width}
          height={asset.height}
          sizes={r.sizes}
          quality={75}
          className="photo-img"
          style={{ objectPosition: photo.position }}
        />
      </div>
      <figcaption className="t-caption mt-2 flex flex-wrap justify-between gap-x-6">
        {asset.caption ? <span>{asset.caption}</span> : null}
        <span className="ms-auto">Photo: {creator} / Unsplash</span>
      </figcaption>
    </figure>
  );
}
