import Image from "next/image";
import logo from "../../../brand/logos/primary/dechy-logo.png";
import logoWhite from "../../../public/brand/dechy-logo-white.png";

/**
 * The approved DECHY PNG logo, used exactly as supplied: not redrawn, recolored, stretched, or
 * given effects. The source image has generous blank margins; this component only frames the
 * artwork (CSS positioning of the unchanged image) and uses darken blending (exact on Warm Off White) so the file's
 * near-white background does not show as a box on the Warm Off White page.
 *
 * The approved site logo is the DECHY wordmark without the descriptor (owner direction,
 * 7 October 2026); the descriptor appears as text beside it where needed.
 * Artwork bounds measured in the 2172 x 724 source: x 198..1980, y 206..537. The frame adds
 * about 10px of breathing room on each side.
 */
const SRC_W = 2172;
const SRC_H = 724;
const FRAME = { x: 188, y: 196, w: 1803, h: 352 };

export function Logo({
  className = "",
  priority = false,
  sizes,
  tone = "light",
}: {
  className?: string;
  priority?: boolean;
  sizes: string;
  /** "dark": the owner's white logo for dark surfaces (header, footer), from the SVG master. */
  tone?: "light" | "dark";
}) {
  if (tone === "dark")
    return (
      <Image
        src={logoWhite}
        alt="DECHY logo"
        sizes={sizes}
        quality={92}
        priority={priority}
        className={`block w-auto ${className}`}
      />
    );
  // Percentages are relative to the frame (the positioned parent).
  const widthPct = (SRC_W / FRAME.w) * 100;
  const leftPct = -(FRAME.x / FRAME.w) * 100;
  const topPct = -(FRAME.y / FRAME.h) * 100;
  return (
    <span
      className={`relative block overflow-hidden ${className}`}
      style={{ aspectRatio: `${FRAME.w} / ${FRAME.h}` }}
    >
      <Image
        src={logo}
        alt="DECHY"
        width={SRC_W}
        height={SRC_H}
        sizes={sizes}
        quality={92}
        priority={priority}
        style={{
          position: "absolute",
          width: `${widthPct}%`,
          maxWidth: "none",
          height: "auto",
          left: `${leftPct}%`,
          top: `${topPct}%`,
          mixBlendMode: "darken",
        }}
      />
    </span>
  );
}
