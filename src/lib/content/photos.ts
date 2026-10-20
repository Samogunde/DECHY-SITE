import type { PhotoRef } from "./schema";

/** Every photograph placed in a block, including those inside its items (cards, phases). */
export function blockPhotos(value: unknown, out: PhotoRef[] = []): PhotoRef[] {
  if (Array.isArray(value)) for (const v of value) blockPhotos(v, out);
  else if (value && typeof value === "object") {
    const o = value as Record<string, unknown>;
    if (
      typeof o.asset === "string" &&
      o.asset.startsWith("asset.photo-") &&
      typeof o.layout === "string"
    )
      out.push(o as unknown as PhotoRef);
    else for (const v of Object.values(o)) blockPhotos(v, out);
  }
  return out;
}
