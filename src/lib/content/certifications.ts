import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import { z } from "zod";

/** The team's certifications (data/certifications/certifications.yaml), grouped by area. */
const CertFile = z.object({
  groups: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
        summary: z.string(),
        items: z
          .array(
            z.object({
              name: z.string(),
              issuer: z.string(),
              file: z.string().regex(/^[a-z0-9-]+\.png$/),
              text: z.string(),
            }),
          )
          .min(1),
      }),
    )
    .min(1),
});
export type CertGroup = z.infer<typeof CertFile>["groups"][number];
export type Cert = CertGroup["items"][number];

let cache: CertGroup[] | undefined;
export function certificationGroups(): CertGroup[] {
  cache ??= CertFile.parse(
    YAML.parse(
      fs.readFileSync(
        path.join(
          /*turbopackIgnore: true*/ process.cwd(),
          "data/certifications/certifications.yaml",
        ),
        "utf8",
      ),
    ),
  ).groups;
  return cache;
}

export const certificationSrc = (c: Cert) => `/certifications/${c.file}`;

/** The badges shown in a strip (home, About us): the strongest from each area, in order. */
export function featuredCertifications(limit: number): Cert[] {
  const groups = certificationGroups();
  const out: Cert[] = [];
  for (let round = 0; out.length < limit; round++) {
    let added = false;
    for (const g of groups) {
      const c = g.items[round];
      if (c && out.length < limit) {
        out.push(c);
        added = true;
      }
    }
    if (!added) break;
  }
  return out;
}

/** Partner programs and compliance standards the owner confirmed (data/partners/partnerships.yaml). */
const PartnerFile = z.object({
  partners: z
    .array(z.object({ name: z.string(), program: z.string(), short: z.string(), text: z.string() }))
    .min(1),
  compliance: z.array(z.object({ name: z.string(), text: z.string() })).min(1),
});
export type Partnerships = z.infer<typeof PartnerFile>;

let partnerCache: Partnerships | undefined;
export function partnerships(): Partnerships {
  partnerCache ??= PartnerFile.parse(
    YAML.parse(
      fs.readFileSync(
        path.join(/*turbopackIgnore: true*/ process.cwd(), "data/partners/partnerships.yaml"),
        "utf8",
      ),
    ),
  );
  return partnerCache;
}
