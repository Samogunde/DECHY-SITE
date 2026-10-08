/**
 * next/image loader for Netlify builds. Netlify's Image CDN chooses the output format from the
 * browser's Accept header (AVIF when it can), which measurably softens photographic detail at the
 * same quality. This loader asks for WebP explicitly (`fm=webp`) at the quality the component sets.
 * Used only when the site is built on Netlify (see next.config.ts); elsewhere Next's own optimizer
 * serves WebP per `images.formats`.
 */
export default function netlifyImageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  const params = new URLSearchParams({
    url: src,
    w: String(width),
    q: String(quality ?? 85),
    fm: "webp",
  });
  return `/.netlify/images?${params}`;
}
