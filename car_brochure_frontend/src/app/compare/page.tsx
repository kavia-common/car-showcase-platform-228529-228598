"use client";

import EmptyState from "@/components/EmptyState";
import { api } from "@/lib/api";
import type { CarModel } from "@/lib/types";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useMemo, useState } from "react";

function Cell({ value }: { value?: string | number | null }) {
  return <td className="p-3 border-t border-[rgba(231,240,255,.10)] text-sm">{value ?? "—"}</td>;
}

function CompareInner() {
  const sp = useSearchParams();
  const ids = useMemo(() => {
    const q = sp.get("ids") || "";
    return q
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 3);
  }, [sp]);

  const [models, setModels] = useState<CarModel[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    async function load() {
      if (ids.length === 0) {
        setModels([]);
        return;
      }
      setLoading(true);
      const results = ids.length >= 2 ? await api.compare(ids) : [];
      if (alive) {
        setModels(results);
        setLoading(false);
      }
    }
    load().catch(() => {
      if (alive) setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [ids]);

  return (
    <div className="surface scanlines p-6 md:p-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="h2 font-black neon">Compare</h1>
          <p className="lead mt-2">
            Compare up to 3 models. Add IDs via <span className="kbd">?ids=a,b,c</span> or from a model page.
          </p>
        </div>
        <Link className="btn btn-primary" href="/models">
          Pick models
        </Link>
      </div>

      <hr className="hr my-5" />

      {loading ? <p className="lead">Loading selected models…</p> : null}

      {ids.length === 0 ? (
        <EmptyState
          title="No models selected"
          description="Open a model page and click Compare, or pass ids in the URL."
          hint="Example: /compare?ids=model-1,model-2"
        />
      ) : null}

      {ids.length > 0 && models.length === 0 && !loading ? (
        <EmptyState
          title="Nothing to compare"
          description="The backend might not support /models/{id} yet."
          hint="Implement model detail endpoint in backend and reload."
        />
      ) : null}

      {models.length > 0 ? (
        <div className="panel overflow-auto">
          <table className="min-w-[720px] w-full border-collapse">
            <thead>
              <tr className="text-left">
                <th className="p-3 text-xs text-[color:var(--muted)]">Field</th>
                {models.map((m) => (
                  <th key={m.id} className="p-3">
                    <div className="font-black">
                      {m.make} {m.model}
                    </div>
                    <div className="text-xs text-[color:var(--muted)]">{m.year ?? "—"}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 text-xs text-[color:var(--muted)]">Body type</td>
                {models.map((m) => (
                  <Cell key={m.id} value={m.specs?.bodyType} />
                ))}
              </tr>
              <tr>
                <td className="p-3 text-xs text-[color:var(--muted)]">Drivetrain</td>
                {models.map((m) => (
                  <Cell key={m.id} value={m.specs?.drivetrain} />
                ))}
              </tr>
              <tr>
                <td className="p-3 text-xs text-[color:var(--muted)]">Transmission</td>
                {models.map((m) => (
                  <Cell key={m.id} value={m.specs?.transmission} />
                ))}
              </tr>
              <tr>
                <td className="p-3 text-xs text-[color:var(--muted)]">Horsepower</td>
                {models.map((m) => (
                  <Cell key={m.id} value={m.specs?.horsepower} />
                ))}
              </tr>
              <tr>
                <td className="p-3 text-xs text-[color:var(--muted)]">0–60</td>
                {models.map((m) => (
                  <Cell key={m.id} value={m.specs?.zeroToSixty ? `${m.specs?.zeroToSixty}s` : null} />
                ))}
              </tr>
              <tr>
                <td className="p-3 text-xs text-[color:var(--muted)]">Range</td>
                {models.map((m) => (
                  <Cell key={m.id} value={m.specs?.rangeMiles ? `${m.specs?.rangeMiles} mi` : null} />
                ))}
              </tr>
              <tr>
                <td className="p-3 text-xs text-[color:var(--muted)]">Price from</td>
                {models.map((m) => (
                  <Cell
                    key={m.id}
                    value={typeof m.priceFrom === "number" ? `${m.currency || "USD"} ${m.priceFrom}` : null}
                  />
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}

// PUBLIC_INTERFACE
export default function ComparePage() {
  /** Compare page wrapper that provides a Suspense boundary required for useSearchParams() during static export. */
  return (
    <Suspense
      fallback={
        <div className="surface scanlines p-6 md:p-8">
          <div className="h2 font-black neon">Loading…</div>
          <p className="lead mt-2">Preparing comparison table.</p>
        </div>
      }
    >
      <CompareInner />
    </Suspense>
  );
}
