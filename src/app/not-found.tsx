import type { Metadata } from "next";
import { LinkButton } from "@/components/primitives/LinkButton";
import { EntityName } from "@/components/primitives/Inline";
import { getRegistry } from "@/lib/content/load";

export const metadata: Metadata = {
  title: { absolute: "Page not found | DECHY" },
  robots: { index: false, follow: false },
};

export default function NotFound() {
  const { services } = getRegistry();
  return (
    <div className="section">
      <div className="container-site">
        <p className="t-eyebrow m-0">Error 404</p>
        <h1 className="t-h1 mt-3 max-w-[22ch]">That page does not exist.</h1>
        <p className="t-lead mt-5">
          The address may be mistyped, or the page may have moved. Start from the homepage, or
          browse what DECHY builds.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <LinkButton href="/">Go to the homepage</LinkButton>
          <LinkButton href="/contact/" variant="secondary">
            Talk to DECHY
          </LinkButton>
        </div>
        <h2 className="t-h4 mt-14">Services</h2>
        <ul className="m-0 mt-4 grid list-none gap-x-8 gap-y-1 p-0 min-[40rem]:grid-cols-2 min-[64rem]:grid-cols-3">
          {services.map((s) => (
            <li key={s.id} className="py-1.5">
              <EntityName id={s.id} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
