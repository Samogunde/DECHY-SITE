import Image from "next/image";
import { getRegistry } from "@/lib/content/load";
import { frameRatio, photoSizes, ratioCss } from "@/lib/content/photo-geometry";
import type { PhotoRef } from "@/lib/content/schema";

export { photoSizes };

/** Photographs are delivered as WebP at this quality: measured to keep 94 to 100 percent of the
 *  source's fine detail, where AVIF at the highest allowed setting kept about 85 percent. */
export const PHOTO_QUALITY = 85;

/**
 * A registered photograph. Alt text, dimensions and any descriptive caption come from the asset
 * registry (data/assets/images.yaml), so a photograph cannot be shown without provenance.
 * Framing is CSS only; the stored file is never cropped. `sizes` describes the width the photograph
 * is actually painted at (see src/lib/content/photo-geometry.ts), so the browser never downloads a
 * copy that is then stretched.
 */
export function Photo({ photo, className = "" }: { photo: PhotoRef; className?: string }) {
  const asset = getRegistry().assets.find((a) => a.id === photo.asset);
  if (!asset || !asset.width || !asset.height) throw new Error(`Unknown photograph ${photo.asset}`);
  const ratio = asset.width / asset.height;
  const src = `/${asset.file.replace(/^public\//, "")}`;
  const style = {
    "--ar-sm": ratioCss(frameRatio(photo.layout, "sm", ratio)),
    "--ar-md": ratioCss(frameRatio(photo.layout, "md", ratio)),
    "--ar-lg": ratioCss(frameRatio(photo.layout, "lg", ratio)),
  } as React.CSSProperties;
  return (
    <figure className={`photo ${className}`.trim()} data-reveal="image">
      <div className="photo-frame" style={style}>
        <Image
          src={src}
          alt={asset.alt}
          width={asset.width}
          height={asset.height}
          sizes={photoSizes(photo.layout, ratio)}
          quality={PHOTO_QUALITY}
          className="photo-img"
          style={{ objectPosition: photo.position }}
        />
      </div>
      {/* Only a descriptive caption is ever shown. Source and creator live in the asset registry
          and license evidence, never on the page. */}
      {asset.caption ? (
        <figcaption className="figure-caption t-caption">{asset.caption}</figcaption>
      ) : null}
    </figure>
  );
}
