// Prepares the owner's certification badges for the site (owner, 21 October 2026).
// Usage: node scripts/prepare-certification-badges.mjs <folder with the supplied badges>
// Removes a plain background (flood fill from the edges, so the badge itself is never touched),
// trims the empty margin, and writes a transparent PNG with a descriptive name to
// public/certifications/. The badge artwork is never redrawn or recolored.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const src = process.argv[2];
if (!src) throw new Error("Pass the folder with the supplied badges");
const out = "public/certifications";
fs.mkdirSync(out, { recursive: true });

// Supplied file -> published name. The smaller duplicate of the AWS Generative AI badge is skipped.
const FILES = {
  "AWS-Solutions-Architect-PRO-Badge-1.webp": "aws-certified-solutions-architect-professional",
  "1268_AWS_Cert_Template_badges_DevOps-Engineer.a4c4c73d9653ac56bc94410807674301ad22a9df.png":
    "aws-certified-devops-engineer-professional",
  "AWS-.webp": "aws-certified-generative-ai-developer-professional",
  "dva-badge-resized.394ea371e1961974071ff26aee8b0edade59f194.png":
    "aws-certified-developer-associate",
  "1772978322430.jpg": "microsoft-certified-azure-ai-engineer-associate",
  "AZ-203-Microsoft-Certified-Azure-Developer-Associate.jpg":
    "microsoft-certified-azure-developer-associate",
  "microsoft-certified-azure-ai-apps-and-agents-developer-associate-ai-103-training-771580177572313_m.webp":
    "microsoft-certified-azure-ai-apps-and-agents-developer-associate",
  "images.png": "microsoft-certified-ai-agent-builder-associate",
  "badge-m365-dev-associate.png": "microsoft-365-certified-developer-associate",
  "1774287258127.jpg": "google-cloud-certified-cloud-digital-leader",
  "image (15).png": "google-cybersecurity-certificate-comptia-security-plus",
  "2026-07_Salesforce_Certified_B2C_Commerce_Developer.png":
    "salesforce-certified-b2c-commerce-developer",
  "Platform-Developer-II.png": "salesforce-certified-platform-developer-ii",
  "badge-agentic-CGmH6Auv.png": "github-agentic-ai-developer",
  "twitter_thumb_201604_Digital_Mar_Assoc_800.png": "meta-certified-digital-marketing-associate",
  "PMI-PMP.png": "pmi-project-management-professional-pmp",
  "Certiprof_AI_Risk_Manager.png": "certiprof-ai-risk-manager",
  "Certiprof_ProjectManagementEssentials_badge.webp": "certiprof-project-management-essentials",
  "Badge-Certified@4x-1.webp": "moz-seo-essentials-certified",
  "badge-seo.png": "seo-expert-certification",
  "6214249_2241_4.webp": "zoho-creator-certified-developer-associate",
  "image (14).png": "edchart-certified-flutter-developer",
};

/** Clears pixels connected to the border that are close to the border color. */
function clearBackground(data, w, h) {
  const at = (x, y) => (y * w + x) * 4;
  const corner = [0, 0, 0];
  const samples = [at(0, 0), at(w - 1, 0), at(0, h - 1), at(w - 1, h - 1)];
  for (const i of samples) for (let c = 0; c < 3; c++) corner[c] += data[i + c] / 4;
  const dist = (i) =>
    Math.hypot(data[i] - corner[0], data[i + 1] - corner[1], data[i + 2] - corner[2]);
  const HARD = 24; // inside this distance: background
  const SOFT = 60; // up to this distance at the edge: partly transparent (anti-aliasing)
  const seen = new Uint8Array(w * h);
  const stack = [];
  for (let x = 0; x < w; x++) stack.push([x, 0], [x, h - 1]);
  for (let y = 0; y < h; y++) stack.push([0, y], [w - 1, y]);
  while (stack.length) {
    const [x, y] = stack.pop();
    if (x < 0 || y < 0 || x >= w || y >= h) continue;
    const p = y * w + x;
    if (seen[p]) continue;
    seen[p] = 1;
    const i = p * 4;
    if (data[i + 3] === 0) {
      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
      continue;
    }
    const d = dist(i);
    if (d <= HARD) {
      data[i + 3] = 0;
      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    } else if (d < SOFT) {
      // Edge pixel: keep it, fade it in proportion to how close it is to the background.
      data[i + 3] = Math.round(data[i + 3] * ((d - HARD) / (SOFT - HARD)));
    }
  }
}

for (const [file, name] of Object.entries(FILES)) {
  const input = path.join(src, file);
  const img = sharp(input).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const opaqueCorners = [
    0,
    info.width - 1,
    (info.height - 1) * info.width,
    info.width * info.height - 1,
  ]
    .map((p) => data[p * 4 + 3])
    .every((a) => a > 250);
  if (opaqueCorners) clearBackground(data, info.width, info.height);
  const target = path.join(out, `${name}.png`);
  await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .trim({ threshold: 1 })
    .resize(640, 640, { fit: "inside", withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toFile(target);
  const m = await sharp(target).metadata();
  console.log(`${name}.png ${m.width}x${m.height}${opaqueCorners ? " (background removed)" : ""}`);
}
