/**
 * A heading with a few words in the brand blue (owner, 22 October 2026), written in content as
 * [[these words]], for example "What changed for our clients, [[in their own words]]". Use it on
 * some headings, not all. Wherever a heading becomes plain text (labels, metadata, search) the
 * marks are removed (plainHeading in src/lib/content/inline.ts).
 */
export function AccentText({ text }: { text: string }) {
  const parts = text.split(/\[\[(.+?)\]\]/);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 ? (
          <span key={i} className="h-accent">
            {p}
          </span>
        ) : (
          p
        ),
      )}
    </>
  );
}
