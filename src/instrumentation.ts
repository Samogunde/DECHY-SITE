/**
 * Runs once when the server starts. Parses the content registry up front, so the first visitor
 * request after a start (or a cold serverless instance) does not wait for it. A failure here never
 * stops the server: the registry is then simply parsed on first use, as before.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  try {
    const { getRegistry } = await import("@/lib/content/load");
    getRegistry();
  } catch {
    // parsed lazily on first use instead
  }
}
