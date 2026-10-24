import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchPage } from "@/components/patterns/search/SearchPage";
import { absoluteUrl } from "@/lib/site";

// Search results are for visitors only: never indexed, never in the sitemap.
export const metadata: Metadata = {
  title: "Search | DECHY",
  description: "Search every DECHY page, service, industry, article, question, and team member.",
  robots: { index: false, follow: true },
  alternates: { canonical: absoluteUrl("/search/") },
};

export default function Page() {
  return (
    <section className="search-page-wrap" aria-labelledby="search-h">
      <div className="container-site">
        <p className="t-eyebrow eyebrow-accent m-0">Search</p>
        <h1 id="search-h" className="t-h2 mt-3">
          Search the site
        </h1>
        <Suspense fallback={null}>
          <SearchPage />
        </Suspense>
      </div>
    </section>
  );
}
