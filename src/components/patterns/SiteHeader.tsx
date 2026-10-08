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
        <Link href="/" aria-label="DECHY home" className="flex min-h-11 shrink-0 items-center">
          <Logo
            priority
            sizes="(min-width: 80rem) 190px, 170px"
            className="h-7 min-[30rem]:h-8 min-[80rem]:h-9"
          />
        </Link>
        <HeaderNav model={model} />
      </div>
    </header>
  );
}
