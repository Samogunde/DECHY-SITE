/**
 * Writes public/__forms.html: a hidden copy of each website form so Netlify Forms registers it at
 * deploy time (Next.js renders the real forms with JavaScript, which Netlify cannot see). The field
 * names come from src/lib/contact/netlify-forms.ts; a unit test fails if the file is out of date.
 * Run: npx tsx scripts/build-netlify-forms.ts
 */
import { writeFileSync } from "node:fs";
import { formsSkeleton } from "../src/lib/contact/forms-skeleton";

writeFileSync("public/__forms.html", formsSkeleton());
console.log("wrote public/__forms.html");
