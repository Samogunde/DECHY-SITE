/**
 * Directional arrow for links and buttons. Decorative (the link text carries the meaning), drawn
 * as SVG so it renders identically in every font. Its forward nudge on hover is defined in
 * globals.css (.arrow) and removed under prefers-reduced-motion.
 */
export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`arrow ${className}`.trim()}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M2.5 8h10.5M9 4l4 4-4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
