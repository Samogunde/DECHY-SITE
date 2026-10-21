/**
 * Brand files from the owner's SVG masters (20 October 2026). Masters are never edited; each
 * derivative is the master rendered at a size, trimmed of empty margin, nothing else.
 *
 *   brand/logos/dark/dechy-logo-white.svg     -> public/brand/dechy-logo-white.png (site logo on dark)
 *   brand/monogram/dechy-monogram-tile.svg    -> src/app/favicon.ico (16, 32, 48), src/app/icon.png (96),
 *        src/app/apple-icon.png (180), public/icons/icon-192.png, icon-512.png,
 *        public/brand/dechy-monogram.png (128, the assistant launcher)
 *   brand/monogram/dechy-monogram-white.svg   -> public/brand/dechy-monogram-white.png (512)
 *
 * Run: npx tsx scripts/brand-v2.ts
 */
import fs from "node:fs";
import sharp from "sharp";

const LOGO = "brand/logos/dark/dechy-logo-white.svg";
const TILE = "brand/monogram/dechy-monogram-tile.svg";
const MONO = "brand/monogram/dechy-monogram-white.svg";

const tile = (size: number) =>
  sharp(TILE, { density: Math.ceil((72 * size) / 256) * 2 })
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toBuffer();

/** A Windows icon file holding PNG images (supported by every current browser). */
function ico(images: { size: number; data: Buffer }[]): Buffer {
  const head = Buffer.alloc(6 + images.length * 16);
  head.writeUInt16LE(0, 0);
  head.writeUInt16LE(1, 2);
  head.writeUInt16LE(images.length, 4);
  let offset = head.length;
  images.forEach((img, i) => {
    const o = 6 + i * 16;
    head.writeUInt8(img.size >= 256 ? 0 : img.size, o);
    head.writeUInt8(img.size >= 256 ? 0 : img.size, o + 1);
    head.writeUInt16LE(1, o + 4);
    head.writeUInt16LE(32, o + 6);
    head.writeUInt32LE(img.data.length, o + 8);
    head.writeUInt32LE(offset, o + 12);
    offset += img.data.length;
  });
  return Buffer.concat([head, ...images.map((i) => i.data)]);
}

async function main() {
  fs.mkdirSync("public/brand", { recursive: true });
  fs.mkdirSync("public/icons", { recursive: true });
  // Logo: rendered at twice the master's size, then trimmed to the artwork.
  await sharp(LOGO, { density: 192 })
    .trim()
    .toBuffer()
    .then((b) =>
      sharp(b)
        .resize(2400)
        .png({ compressionLevel: 9 })
        .toFile("public/brand/dechy-logo-white.png"),
    );
  const sizes = [16, 32, 48];
  fs.writeFileSync(
    "src/app/favicon.ico",
    ico(await Promise.all(sizes.map(async (size) => ({ size, data: await tile(size) })))),
  );
  fs.writeFileSync("src/app/icon.png", await tile(96));
  fs.writeFileSync("src/app/apple-icon.png", await tile(180));
  fs.writeFileSync("public/icons/icon-192.png", await tile(192));
  fs.writeFileSync("public/icons/icon-512.png", await tile(512));
  fs.writeFileSync("public/brand/dechy-monogram.png", await tile(128));
  await sharp(MONO, { density: 9 })
    .resize(512)
    .png()
    .toFile("public/brand/dechy-monogram-white.png");
  const m = await sharp("public/brand/dechy-logo-white.png").metadata();
  console.log("logo", m.width, "x", m.height);
}
main();
