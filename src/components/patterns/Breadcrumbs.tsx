import Link from "next/link";
import type { Crumb } from "@/lib/content/breadcrumbs";

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  if (crumbs.length < 2) return null;
  return (
    <nav aria-label="Breadcrumb" className="t-caption">
      <ol className="m-0 flex list-none flex-wrap items-center gap-x-2 gap-y-1 p-0">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={c.path} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className="font-semibold text-ink">
                  {c.label}
                </span>
              ) : (
                <>
                  <Link
                    href={c.path}
                    className="inline-flex min-h-11 items-center text-slate-text underline lg:min-h-8"
                  >
                    {c.label}
                  </Link>
                  <span aria-hidden="true">/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
