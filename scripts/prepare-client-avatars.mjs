// Makes the small portraits beside the "clients helped" figure (owner, 21 October 2026): each
// licensed library portrait is cropped to head and shoulders, its plain studio background is
// replaced with the brand blue, and it is saved as a small WebP in public/avatars/.
// Usage: node scripts/prepare-client-avatars.mjs <library id>[@side@top] ...
//   side: the crop's share of the shorter edge (default 0.62); top: its top offset (default 0.04).
import fs from "node:fs";
import sharp from "sharp";

const BLUE = [47, 111, 237]; // #2F6FED, the brand blue
const SIZE = 192; // shown at 40 to 48 px, so this covers 4x screens
const out = "public/avatars";
fs.mkdirSync(out, { recursive: true });

for (const [n, arg] of process.argv.slice(2).entries()) {
  const [id = "", sideShare = "0.62", topShare = "0.04"] = arg.split("@");
  const file = ["jpg", "png", "webp"].map((e) => `public/photos/${id}.${e}`).find(fs.existsSync);
  if (!file) throw new Error(`No library photo ${id}`);
  // Head and shoulders: a square from the top of the frame, centered on the face.
  const meta = await sharp(file).metadata();
  const side = Math.round(Math.min(meta.width, meta.height) * Number(sideShare));
  const left = Math.round((meta.width - side) / 2);
  const top = Math.round(meta.height * Number(topShare));
  const { data, info } = await sharp(file)
    .extract({ left, top, width: side, height: side })
    .resize(SIZE * 2, SIZE * 2)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  const at = (x, y) => (y * w + x) * 4;
  const ref = [0, 0, 0];
  for (const i of [at(2, 2), at(w - 3, 2)]) for (let c = 0; c < 3; c++) ref[c] += data[i + c] / 2;
  const dist = (i) => Math.hypot(data[i] - ref[0], data[i + 1] - ref[1], data[i + 2] - ref[2]);
  // Flood from the top edge and the upper sides only, so clothing at the bottom is never reached.
  const seen = new Uint8Array(w * h);
  const stack = [];
  for (let x = 0; x < w; x++) stack.push([x, 0]);
  for (let y = 0; y < h * 0.6; y++) stack.push([0, y], [w - 1, y]);
  const mix = new Float32Array(w * h);
  while (stack.length) {
    const [x, y] = stack.pop();
    if (x < 0 || y < 0 || x >= w || y >= h) continue;
    const p = y * w + x;
    if (seen[p]) continue;
    seen[p] = 1;
    const d = dist(p * 4);
    if (d <= 30) {
      mix[p] = 1;
      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    } else if (d < 70) mix[p] = (70 - d) / 40;
  }
  for (let p = 0; p < w * h; p++) {
    const m = mix[p];
    if (!m) continue;
    for (let c = 0; c < 3; c++)
      data[p * 4 + c] = Math.round(data[p * 4 + c] * (1 - m) + BLUE[c] * m);
  }
  const target = `${out}/dechy-client-${n + 1}.webp`;
  await sharp(data, { raw: { width: w, height: h, channels: 4 } })
    .resize(SIZE, SIZE)
    .webp({ quality: 90 })
    .toFile(target);
  console.log(target, "from", id);
}
