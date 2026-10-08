import type { Metadata } from "next";
import { PageView } from "@/components/sections/PageView";
import { getPage } from "@/lib/content/load";
import { pageMetadata } from "@/lib/seo/metadata";

export function generateMetadata(): Metadata {
  return pageMetadata(getPage("/contact/"));
}

export default function Page() {
  return <PageView path="/contact/" />;
}
