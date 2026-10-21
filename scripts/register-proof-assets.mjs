// Registers the certification badges and the client-face avatars in data/assets/images.yaml
// (owner, 21 October 2026). Safe to run again: entries already present are skipped.
import crypto from "node:crypto";
import fs from "node:fs";
import sharp from "sharp";
import YAML from "yaml";

const REGISTRY = "data/assets/images.yaml";
const text = fs.readFileSync(REGISTRY, "utf8");
const existing = new Set(YAML.parse(text).assets.map((a) => a.id));
const today = "2026-10-21";
const q = (s) => JSON.stringify(s);
const entries = [];

async function entry(file, fields) {
  const id = `asset.${fields.prefix}-${file
    .split("/")
    .pop()
    .replace(/\.[a-z]+$/, "")}`;
  if (existing.has(id)) return;
  const buf = fs.readFileSync(file);
  const { width, height } = await sharp(buf).metadata();
  const sha = crypto.createHash("sha256").update(buf).digest("hex");
  entries.push(
    [
      `  - id: ${id}`,
      `    kind: file`,
      `    file: ${file}`,
      `    role: ${fields.role}`,
      `    source: ${fields.source}`,
      `    creator: ${q(fields.creator)}`,
      `    license: ${q(fields.license)}`,
      ...(fields.sourceUrl ? [`    sourceUrl: ${fields.sourceUrl}`] : []),
      ...(fields.licenseUrl ? [`    licenseUrl: ${fields.licenseUrl}`] : []),
      `    sha256: ${sha}`,
      `    width: ${width}`,
      `    height: ${height}`,
      `    alt: ${q(fields.alt)}`,
      `    usage: [${fields.usage}]`,
      `    approval: approved`,
      `    acquired: "${today}"`,
      "",
    ].join("\n"),
  );
}

// Certification badges: issued to DECHY team members, supplied by the owner.
const certs = YAML.parse(fs.readFileSync("data/certifications/certifications.yaml", "utf8"));
for (const g of certs.groups)
  for (const c of g.items)
    await entry(`public/certifications/${c.file}`, {
      prefix: "cert",
      role: "logo",
      source: "owner-supplied",
      creator: c.issuer,
      license: `Certification badge issued by ${c.issuer} to a DECHY team member, supplied by the owner. Background removed only. Evidence in data/assets/licenses/certifications.md.`,
      alt: `${c.name} badge`,
      usage: "certifications",
    });

// Client faces: derived from licensed library portraits (background replaced with brand blue).
const lib = YAML.parse(text).assets;
const FACES = ["lib-portraits-f-24", "lib-portraits-m-47", "lib-portraits-f-02"];
for (const [i, id] of FACES.entries()) {
  const src = lib.find((a) => a.id === `asset.photo-${id}`);
  if (!src) throw new Error(`Missing library entry for ${id}`);
  await entry(`public/avatars/dechy-client-${i + 1}.webp`, {
    prefix: "avatar",
    role: "photograph",
    source: "licensed-stock",
    creator: src.creator,
    license: `${src.license} Cropped and background replaced with the brand blue (scripts/prepare-client-avatars.mjs).`,
    sourceUrl: src.sourceUrl,
    licenseUrl: src.licenseUrl,
    alt: "Portrait beside the clients helped figure",
    usage: "client-faces",
  });
}

if (entries.length) {
  fs.writeFileSync(REGISTRY, `${text.trimEnd()}\n\n${entries.join("\n")}`);
}
console.log(`registered ${entries.length}`);
