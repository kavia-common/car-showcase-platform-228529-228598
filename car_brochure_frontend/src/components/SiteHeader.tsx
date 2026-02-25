"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useMemo, useState } from "react";

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = useMemo(() => pathname === href || (href !== "/" && pathname?.startsWith(href)), [pathname, href]);

  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-xl border transition ${
        active
          ? "border-[rgba(6,182,212,.6)] bg-[rgba(6,182,212,.10)]"
          : "border-[rgba(231,240,255,.14)] bg-[rgba(11,16,32,.35)] hover:bg-[rgba(11,16,32,.55)]"
      }`}
    >
      <span className="text-sm font-semibold">{label}</span>
    </Link>
  );
}

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full sticky top-0 z-40 backdrop-blur border-b border-[rgba(231,240,255,.10)] bg-[rgba(11,16,32,.55)]">
      <div className="container py-3 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl border border-[rgba(231,240,255,.14)] bg-[rgba(15,26,51,.65)] grid place-items-center shadow">
            <span className="text-sm font-black tracking-tight">CR</span>
          </div>
          <div className="leading-tight">
            <div className="font-black text-[15px] neon">ChromeRetro</div>
            <div className="text-xs text-[color:var(--muted)]">car brochure terminal</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          <NavLink href="/" label="Home" />
          <NavLink href="/models" label="Models" />
          <NavLink href="/compare" label="Compare" />
          <NavLink href="/contact" label="Contact" />
          <NavLink href="/admin" label="Admin" />
        </nav>

        <button className="md:hidden btn" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="mobile-nav">
          Menu
        </button>
      </div>

      {open && (
        <div id="mobile-nav" className="md:hidden border-t border-[rgba(231,240,255,.10)]">
          <div className="container py-3 flex flex-wrap gap-2">
            <NavLink href="/" label="Home" />
            <NavLink href="/models" label="Models" />
            <NavLink href="/compare" label="Compare" />
            <NavLink href="/contact" label="Contact" />
            <NavLink href="/admin" label="Admin" />
          </div>
        </div>
      )}
    </header>
  );
}
