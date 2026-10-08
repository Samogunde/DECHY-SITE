/**
 * Photograph frame geometry, shared by the Photo component (its `sizes`) and the content validator
 * (the resolution a photograph needs). One source, so what is checked is what is rendered.
 *
 * Breakpoint classes for the frame's shape: sm below 48rem, md from 48rem, lg from 64rem.
 * Frame widths follow the page container (src/styles/typography-tokens.css): it is 80rem from
 * 80rem, 90rem from 120rem, and 100rem from 160rem, less 3rem gutters on each side. Measured in the
 * browser, a rail frame is 31.6 percent of that content width (32 is used) and a split frame 57
 * percent; an aside is capped at 35rem; a band spans it.
 *
 * Frames crop with `object-fit: cover`. A photograph wider than its frame is scaled to the frame's
 * height and painted wider than the frame, by max(1, photo ratio / frame ratio).
 */
export type PhotoLayout = "rail" | "band" | "split" | "aside";
type Bp = "sm" | "md" | "lg";

const RATIO: Record<PhotoLayout, Record<Bp, number>> = {
  rail: { sm: 4 / 3, md: 16 / 10, lg: 1 },
  band: { sm: 4 / 3, md: 16 / 9, lg: 21 / 9 },
  split: { sm: 4 / 3, md: 16 / 10, lg: 3 / 2 },
  aside: { sm: 16 / 10, md: 16 / 10, lg: 16 / 10 },
};

/** Share of the content width a frame takes on desktop layouts (lg and wider). */
const SHARE: Record<PhotoLayout, number> = { rail: 0.32, split: 0.57, aside: 1, band: 1 };
/** Desktop width cap, in rem, where the layout has one. */
const CAP: Partial<Record<PhotoLayout, number>> = { aside: 35 };
/** Below the fixed containers (64rem to 80rem) frames follow the viewport. */
const FLUID_VW: Record<PhotoLayout, number> = { rail: 29, split: 52, aside: 36, band: 100 };
/** Content width (rem) of the fixed containers, from each min-width (rem). */
const CONTAINERS: [minWidth: number, content: number][] = [
  [160, 94],
  [120, 84],
  [80, 74],
];

/**
 * The frame's aspect ratio. The desktop rail follows the photograph between square and 4:3, so a
 * landscape photograph is not cut down to a square (which would waste most of its pixels).
 */
export function frameRatio(layout: PhotoLayout, bp: Bp, photoRatio: number): number {
  if (layout === "rail" && bp === "lg") return Math.min(4 / 3, Math.max(1, photoRatio));
  return RATIO[layout][bp];
}

/** How much wider than its frame the photograph is painted. */
export function paintedFactor(layout: PhotoLayout, bp: Bp, photoRatio: number): number {
  return Math.max(1, photoRatio / frameRatio(layout, bp, photoRatio));
}

const frameRem = (layout: PhotoLayout, content: number) =>
  Math.min(CAP[layout] ?? Infinity, content * SHARE[layout]);
const round = (n: number) => Math.round(n * 100) / 100;

/** The `sizes` attribute: the width the photograph is painted at, per breakpoint. */
export function photoSizes(layout: PhotoLayout, photoRatio: number): string {
  const lg = paintedFactor(layout, "lg", photoRatio);
  return [
    ...CONTAINERS.map(
      ([min, content]) => `(min-width: ${min}rem) ${round(frameRem(layout, content) * lg)}rem`,
    ),
    `(min-width: 64rem) ${round(FLUID_VW[layout] * lg)}vw`,
    `(min-width: 48rem) ${round(100 * paintedFactor(layout, "md", photoRatio))}vw`,
    `${round(100 * paintedFactor(layout, "sm", photoRatio))}vw`,
  ].join(", ");
}

/**
 * Stored width a photograph needs to stay sharp: twice the widest width it is painted at on
 * screens up to 1920 CSS px (2x), which also covers 2560 CSS px screens at 1x. A full-width band
 * keeps a 2400 px floor.
 */
export function requiredPhotoWidth(layout: PhotoLayout, photoRatio: number): number {
  const widestRem = frameRem(layout, 84);
  const painted = widestRem * 16 * paintedFactor(layout, "lg", photoRatio);
  const need = Math.ceil(painted * 2);
  return layout === "band" ? Math.max(2400, need) : need;
}

export const ratioCss = (r: number) => `${Math.round(r * 1000)} / 1000`;
