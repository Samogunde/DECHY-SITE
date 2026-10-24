/** DECHY Admin as an installable app (owner, 24 October 2026), separate from the public site. */
export const dynamic = "force-static";

export function GET() {
  return Response.json(
    {
      name: "DECHY Admin",
      short_name: "DECHY Admin",
      id: "/admin/",
      start_url: "/admin/",
      scope: "/admin/",
      display: "standalone",
      background_color: "#000000",
      theme_color: "#000000",
      icons: [
        { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
        { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      ],
    },
    { headers: { "Content-Type": "application/manifest+json" } },
  );
}
