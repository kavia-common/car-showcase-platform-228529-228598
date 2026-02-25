import { NextResponse } from "next/server";

export const dynamic = "force-static";

// PUBLIC_INTERFACE
export function GET() {
  /** Returns robots.txt for the static-exported site. */
  const body = `User-agent: *
Allow: /

Sitemap: /sitemap.xml
`;
  return new NextResponse(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
}
