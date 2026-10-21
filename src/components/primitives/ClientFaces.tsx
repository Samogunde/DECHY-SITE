import Image from "next/image";

/**
 * Three small portraits on the brand blue, shown beside the "clients helped" figure (owner,
 * 21 October 2026). Decorative: the figure beside them carries the meaning. The portraits are
 * licensed library photographs (scripts/prepare-client-avatars.mjs), not named clients.
 */
export function ClientFaces({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  return (
    <span className={`client-faces client-faces-${size}`} aria-hidden="true">
      {[1, 2, 3].map((n) => (
        <Image
          key={n}
          src={`/avatars/dechy-client-${n}.webp`}
          alt=""
          width={96}
          height={96}
          sizes="48px"
          quality={90}
        />
      ))}
    </span>
  );
}
