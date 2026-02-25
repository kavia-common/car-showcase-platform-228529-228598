import Link from "next/link";
import React from "react";

export default function SiteFooter() {
  const api = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

  return (
    <footer className="mt-12 border-t border-[rgba(231,240,255,.10)]">
      <div className="container py-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-[color:var(--muted)]">
          <div className="font-semibold text-[color:var(--text)]">ChromeRetro</div>
          <div>Retro brochure UI • Static export friendly</div>
        </div>

        <div className="flex flex-wrap gap-3 text-sm">
          <Link className="underline decoration-[rgba(6,182,212,.55)] underline-offset-4" href="/models">
            Browse models
          </Link>
          <Link className="underline decoration-[rgba(236,72,153,.55)] underline-offset-4" href="/compare">
            Compare
          </Link>
          <Link className="underline decoration-[rgba(59,130,246,.55)] underline-offset-4" href="/contact">
            Contact
          </Link>
        </div>

        <div className="text-xs text-[color:var(--muted)]">
          API base: <span className="kbd">{api}</span>
        </div>
      </div>
    </footer>
  );
}
