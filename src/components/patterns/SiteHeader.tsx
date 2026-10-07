import Link from "next/link";
import { getRegistry } from "@/lib/content/load";
import { buildNavModel } from "@/lib/nav";
import { HeaderNav } from "./HeaderNav";
import { Logo } from "./Logo";

export function SiteHeader() {
  const model = buildNavModel(getRegistry());
  return (
    <header
      data-site-header
      className="sticky top-0 z-50 border-b border-line bg-paper"
      style={{ height: "var(--header-h)" }}
    >
      <div className="container-site flex h-full items-center gap-4">
        <Link href="/" aria-label="DECHY home" className="block shrink-0 py-1.5">
          <Logo
            priority
            sizes="(min-width: 80rem) 220px, 180px"
            className="h-9 min-[30rem]:h-10 min-[80rem]:h-[3.25rem]"
          />
        </Link>
        <HeaderNav model={model} />
      </div>
    </header>
  );
}
