import Image from "next/image";
import logo from "../../../brand/logos/primary/dechy-logo-primary.png";

/**
 * The approved DECHY PNG logo, used exactly as supplied: not redrawn, recolored, stretched, or
 * given effects. The source image has generous blank margins; this component only frames the
 * artwork (CSS positioning of the unchanged image) and uses darken blending (exact on Warm Off White) so the file's
 * near-white background does not show as a box on the Warm Off White page.
 *
 * Artwork bounds measured in the 1536 x 676 source: x 231..1337, y 178..488. The frame adds
 * about 8px of breathing room on each side.
 */
const SRC_W = 1536;
const SRC_H = 676;
const FRAME = { x: 223, y: 170, w: 1122, h: 326 };

export function Logo({
  className = "",
  priority = false,
  sizes,
}: {
  className?: string;
  priority?: boolean;
  sizes: string;
}) {
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
        alt="DECHY: Technology, Software, AI & Digital Solutions"
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
