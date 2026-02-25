import { NextResponse } from "next/server";

export const dynamic = "force-static";

const SITE_URL = "https://example.com";

// PUBLIC_INTERFACE
export function GET() {
  /** Returns a minimal sitemap.xml suitable for static export. */
  const urls = ["/", "/models", "/compare", "/contact", "/admin"];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (p) => `  <url>
    <loc>${SITE_URL}${p}</loc>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
    },
  });
}
