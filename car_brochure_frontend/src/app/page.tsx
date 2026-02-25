"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function Home() {
  const [health, setHealth] = useState<"checking" | "ok" | "down">("checking");

  useEffect(() => {
    let alive = true;
    api
      .health()
      .then(() => {
        if (alive) setHealth("ok");
      })
      .catch(() => {
        if (alive) setHealth("down");
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="surface scanlines p-6 md:p-8">
      <div className="badge mb-4">
        <span className="badge-dot" />
        <span>NEON BROCHURE OS</span>
        <span className="kbd">v0.1</span>
      </div>

      <div className="grid-2 items-start">
        <section>
          <h1 className="h1 font-black neon">
            Browse cars like it’s <span className="text-[color:var(--cyan)]">1999</span>.
          </h1>
          <p className="lead mt-4">
            ChromeRetro is a static-export friendly brochure UI for car models: specs, trims, galleries, comparison,
            leads, and an admin dashboard.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link className="btn btn-primary" href="/models">
              Browse models
            </Link>
            <Link className="btn" href="/compare">
              Compare cars
            </Link>
            <Link className="btn" href="/contact">
              Send a lead
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="badge">
              <span className="badge-dot" style={{ background: "var(--pink)" }} />
              <span>Responsive</span>
            </span>
            <span className="badge">
              <span className="badge-dot" style={{ background: "var(--blue)" }} />
              <span>SEO metadata</span>
            </span>
            <span className="badge">
              <span className="badge-dot" style={{ background: "var(--amber)" }} />
              <span>Static export safe</span>
            </span>
          </div>
        </section>

        <aside className="panel p-5">
          <div className="text-sm font-bold">System status</div>
          <hr className="hr my-3" />
          <div className="flex items-center justify-between">
            <div className="text-sm text-[color:var(--muted)]">Backend</div>
            <div className="text-sm font-semibold">
              {health === "checking" ? (
                <span className="text-[color:var(--muted)]">checking…</span>
              ) : health === "ok" ? (
                <span className="text-[color:var(--green)]">online</span>
              ) : (
                <span className="text-[color:var(--red)]">offline</span>
              )}
            </div>
          </div>

          <p className="help mt-3">
            If the backend only exposes <span className="kbd">/</span>, model pages will show empty states until catalog
            endpoints are available.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link className="btn" href="/admin">
              Admin console
            </Link>
            <Link className="btn" href="/models">
              Model index
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
