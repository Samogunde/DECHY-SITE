/**
 * Compresses the stored photographs (owner, 24 October 2026: the originals were 200 MB). Each
 * photograph keeps at least the width the validator requires for every layout it is placed in
 * (twice its widest painted width, 2400 px for full-width bands), with a floor of 1800 px so a
 * later placement still looks sharp, and never grows. It is re-encoded as a progressive mozjpeg
 * JPEG at quality 84 (PNG originals become .jpg), and the registry's file, width, height, and
 * SHA-256 are updated. A file is only replaced when that saves at least 12 percent.
 *
 * Dry run: npx tsx scripts/compress-photos.ts
 * Apply:   npx tsx scripts/compress-photos.ts --write
 */
import crypto from "node:crypto";
import fs from "node:fs";
import sharp from "sharp";
import { getRegistry } from "../src/lib/content/load";
import { requiredPhotoWidth } from "../src/lib/content/photo-geometry";
import { blockPhotos } from "../src/lib/content/photos";

const WRITE = process.argv.includes("--write");
const FLOOR = 1800;
const QUALITY = 84;
const MIN_SAVING = 0.12;
const REGISTRY = "data/assets/images.yaml";

type Asset = { id: string; file?: string; role?: string; width?: number; height?: number };

async function main() {
  process.env.DECHY_SHOW_DRAFTS = "true";
  const registry = getRegistry();
  const use = new Map<string, Set<string>>();
  for (const page of registry.pages)
    for (const b of page.sections)
      for (const p of blockPhotos(b)) {
        const set = use.get(p.asset) ?? new Set<string>();
        set.add(p.layout);
        use.set(p.asset, set);
      }

  let yaml = fs.readFileSync(REGISTRY, "utf8");
  const assets = registry.assets as unknown as Asset[];
  let before = 0;
  let after = 0;
  let changed = 0;
  for (const a of assets) {
    if (a.role !== "photograph" || !a.file?.startsWith("public/photos/") || !fs.existsSync(a.file))
      continue;
    const buf = fs.readFileSync(a.file);
    before += buf.length;
    const meta = await sharp(buf).metadata();
    const w = meta.width ?? 0;
    const ratio = a.id.startsWith("asset.photo-portfolio-")
      ? Math.min(w / (meta.height ?? 1), 4 / 3)
      : w / (meta.height ?? 1);
    const need = Math.max(
      FLOOR,
      ...[...(use.get(a.id) ?? [])].map((l) => requiredPhotoWidth(l as never, ratio)),
    );
    const target = Math.min(w, need);
    const out = await sharp(buf)
      .rotate()
      .resize({ width: target, withoutEnlargement: true })
      .jpeg({ quality: QUALITY, mozjpeg: true, progressive: true, chromaSubsampling: "4:2:0" })
      .toBuffer();
    const isPng = a.file.endsWith(".png");
    if (!isPng && out.length > buf.length * (1 - MIN_SAVING)) {
      after += buf.length;
      continue;
    }
    after += out.length;
    changed++;
    if (!WRITE) continue;
    const m = await sharp(out).metadata();
    const file = isPng ? a.file.replace(/\.png$/, ".jpg") : a.file;
    fs.writeFileSync(file, out);
    if (file !== a.file) fs.unlinkSync(a.file);
    const sha = crypto.createHash("sha256").update(out).digest("hex");
    // Update this asset's block only: from its id line to the next entry.
    const start = yaml.indexOf(`- id: ${a.id}\n`);
    if (start < 0) throw new Error(`Registry entry not found for ${a.id}`);
    const next = yaml.indexOf("\n  - id: ", start + 1);
    const end = next < 0 ? yaml.length : next;
    const block = yaml
      .slice(start, end)
      .replace(`file: ${a.file}`, `file: ${file}`)
      .replace(/sha256: [0-9a-f]{64}/, `sha256: ${sha}`)
      .replace(/width: \d+/, `width: ${m.width}`)
      .replace(/height: \d+/, `height: ${m.height}`);
    yaml = yaml.slice(0, start) + block + yaml.slice(end);
  }
  if (WRITE) fs.writeFileSync(REGISTRY, yaml);
  const mb = (n: number) => (n / 1e6).toFixed(1);
  console.log(
    `${WRITE ? "Compressed" : "Would compress"} ${changed} photographs: ${mb(before)} MB to ${mb(after)} MB (${Math.round((after / before) * 100)}%).`,
  );
}

void main();
