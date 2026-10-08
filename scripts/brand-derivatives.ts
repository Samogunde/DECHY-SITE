/**
 * Builds every delivery file from the approved brand masters in brand/. Masters are never edited;
 * derivatives are scaled, padded, or have their plain background made transparent, nothing else.
 *
 *   brand/logos/primary/dechy-logo.png                      -> public/brand/dechy-logo.png (byte copy)
 *   brand/social/DECHY Technology Solutions Social Image.png -> public/og/dechy-technology-solutions-social-image.png
 *        (scaled to 1200 wide and padded top and bottom with its own background to 1200 x 630, so
 *         platforms that crop to 1.91:1 never cut into the wordmark or the descriptor)
 *   brand/monogram/DECHY_Monogram_On_Dark_Background.png    -> src/app/favicon.ico (16, 32, 48) and
 *        src/app/icon.png (96), with the white outside the rounded tile made transparent
 *   brand/monogram/Minimalist Navy D Emblem with Blue Accent.png -> src/app/apple-icon.png (180) and
 *        public/icons/icon-192.png, icon-512.png (square crops on the emblem's own white)
 *
 * Run: npx tsx scripts/brand-derivatives.ts
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const p = (...s: string[]) => path.join(root, ...s);

const LOGO = p("brand/logos/primary/dechy-logo.png");
const SOCIAL = p("brand/social/DECHY Technology Solutions Social Image.png");
const TILE = p("brand/monogram/DECHY_Monogram_On_Dark_Background.png");
const EMBLEM = p("brand/monogram/Minimalist Navy D Emblem with Blue Accent.png");

/** The dark tile with its white surround made transparent (edge pixels un-blended from white). */
async function tileWithAlpha(): Promise<ReturnType<typeof sharp>> {
  const { data, info } = await sharp(TILE)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const W = info.width;
  const H = info.height;
  const navy = [6, 24, 42];
  const outside = new Uint8Array(W * H);
  const light = (i: number) => Math.min(data[i * 4]!, data[i * 4 + 1]!, data[i * 4 + 2]!) > 110;
  // Flood fill from the four corners through light pixels: that is the surround, never the white D.
  const stack: number[] = [0, W - 1, (H - 1) * W, H * W - 1];
  while (stack.length) {
    const i = stack.pop()!;
    if (outside[i] || !light(i)) continue;
    outside[i] = 1;
    const x = i % W;
    const y = (i / W) | 0;
    if (x > 0) stack.push(i - 1);
    if (x < W - 1) stack.push(i + 1);
    if (y > 0) stack.push(i - W);
    if (y < H - 1) stack.push(i + W);
  }
  // Grow one pixel so the anti-aliased rim is un-blended too.
  const rim = new Uint8Array(outside);
  for (let i = 0; i < W * H; i++) {
    if (outside[i]) continue;
    const x = i % W;
    const y = (i / W) | 0;
    if (
      (x > 0 && outside[i - 1]) ||
      (x < W - 1 && outside[i + 1]) ||
      (y > 0 && outside[i - W]) ||
      (y < H - 1 && outside[i + W])
    )
      rim[i] = 2;
  }
  for (let i = 0; i < W * H; i++) {
    if (!rim[i]) continue;
    // alpha such that pixel = alpha * navy + (1 - alpha) * white
    let a = 0;
    for (let c = 0; c < 3; c++) a = Math.max(a, (255 - data[i * 4 + c]!) / (255 - navy[c]!));
    a = Math.min(1, Math.max(0, a));
    data[i * 4] = navy[0]!;
    data[i * 4 + 1] = navy[1]!;
    data[i * 4 + 2] = navy[2]!;
    data[i * 4 + 3] = Math.round(a * 255);
  }
  const square = Math.max(W, H);
  return sharp(data, { raw: { width: W, height: H, channels: 4 } }).extend({
    top: Math.floor((square - H) / 2),
    bottom: Math.ceil((square - H) / 2),
    left: Math.floor((square - W) / 2),
    right: Math.ceil((square - W) / 2),
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  });
}

/** A square crop centred on the emblem, padded with its own white so the mark has room. */
async function emblemSquare(size: number): Promise<Buffer> {
  // Artwork bounds measured in the 1536 x 1024 master: x 331..1208, y 155..880.
  const cx = (331 + 1208) / 2;
  const cy = (155 + 880) / 2;
  const side = Math.round(877 * 1.36);
  const left = Math.round(cx - side / 2);
  const top = Math.round(cy - side / 2);
  const meta = await sharp(EMBLEM).metadata();
  const ex = {
    left: Math.max(0, -left),
    top: Math.max(0, -top),
    right: Math.max(0, left + side - meta.width!),
    bottom: Math.max(0, top + side - meta.height!),
  };
  // sharp runs extract before extend inside one pipeline, so pad first, then crop.
  const padded = await sharp(EMBLEM)
    .extend({ ...ex, background: { r: 254, g: 254, b: 254 } })
    .toBuffer();
  return sharp(padded)
    .extract({ left: left + ex.left, top: top + ex.top, width: side, height: side })
    .resize(size, size, { kernel: "lanczos3" })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/** An ICO file holding PNG images (supported by every current browser). */
function ico(pngs: { size: number; data: Buffer }[]): Buffer {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  const dir = Buffer.alloc(16 * pngs.length);
  let offset = 6 + dir.length;
  pngs.forEach((png, k) => {
    const o = k * 16;
    dir.writeUInt8(png.size >= 256 ? 0 : png.size, o);
    dir.writeUInt8(png.size >= 256 ? 0 : png.size, o + 1);
    dir.writeUInt8(0, o + 2);
    dir.writeUInt8(0, o + 3);
    dir.writeUInt16LE(1, o + 4);
    dir.writeUInt16LE(32, o + 6);
    dir.writeUInt32LE(png.data.length, o + 8);
    dir.writeUInt32LE(offset, o + 12);
    offset += png.data.length;
  });
  return Buffer.concat([header, dir, ...pngs.map((x) => x.data)]);
}

async function main() {
  fs.mkdirSync(p("public/brand"), { recursive: true });
  fs.mkdirSync(p("public/og"), { recursive: true });
  fs.mkdirSync(p("public/icons"), { recursive: true });

  fs.copyFileSync(LOGO, p("public/brand/dechy-logo.png"));

  // Social image: 1200 wide, padded to 1200 x 630 with the master's own background.
  const scaled = await sharp(SOCIAL).resize({ width: 1200, kernel: "lanczos3" }).toBuffer();
  const h = (await sharp(scaled).metadata()).height!;
  await sharp(scaled)
    .extend({
      top: Math.floor((630 - h) / 2),
      bottom: Math.ceil((630 - h) / 2),
      background: { r: 254, g: 254, b: 254 },
    })
    .png({ compressionLevel: 9 })
    .toFile(p("public/og/dechy-technology-solutions-social-image.png"));

  const tile = await (await tileWithAlpha()).png().toBuffer();
  const at = (size: number) =>
    sharp(tile).resize(size, size, { kernel: "lanczos3" }).png({ compressionLevel: 9 }).toBuffer();
  fs.writeFileSync(
    p("src/app/favicon.ico"),
    ico([
      { size: 16, data: await at(16) },
      { size: 32, data: await at(32) },
      { size: 48, data: await at(48) },
    ]),
  );
  fs.writeFileSync(p("src/app/icon.png"), await at(96));

  fs.writeFileSync(p("src/app/apple-icon.png"), await emblemSquare(180));
  fs.writeFileSync(p("public/icons/icon-192.png"), await emblemSquare(192));
  fs.writeFileSync(p("public/icons/icon-512.png"), await emblemSquare(512));
  console.log("brand derivatives written");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
