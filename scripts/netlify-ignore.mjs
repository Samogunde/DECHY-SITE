/**
 * Netlify "ignore" step (owner, 24 October 2026: protect the free build minutes). Netlify runs it
 * before each build: exit 0 skips the build, exit 1 builds.
 *   - Deploy previews for pull requests and deploys of other branches are skipped, so only the
 *     production branch ever builds (the UI settings say the same; this is the safety net).
 *   - A push that only changes planning documents is skipped.
 */
import { execSync } from "node:child_process";

const { CONTEXT, CACHED_COMMIT_REF, COMMIT_REF } = process.env;

if (CONTEXT && CONTEXT !== "production") {
  console.log(`Skipping the build: ${CONTEXT} deploys are turned off to save build minutes.`);
  process.exit(0);
}

if (CACHED_COMMIT_REF && COMMIT_REF && CACHED_COMMIT_REF !== COMMIT_REF) {
  try {
    const changed = execSync(`git diff --name-only ${CACHED_COMMIT_REF} ${COMMIT_REF}`, {
      encoding: "utf8",
    })
      .split("\n")
      .filter(Boolean);
    if (changed.length > 0 && changed.every((f) => f.startsWith("docs/"))) {
      console.log("Skipping the build: only planning documents changed.");
      process.exit(0);
    }
  } catch {
    // history not available: build to be safe
  }
}

process.exit(1);
