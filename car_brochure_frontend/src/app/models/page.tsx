"use client";

import EmptyState from "@/components/EmptyState";
import { api } from "@/lib/api";
import type { CarModel } from "@/lib/types";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";

function ModelCard({ car }: { car: CarModel }) {
  const title = `${car.make} ${car.model}`;
  const subtitle = car.year ? `${car.year}` : car.tagline || "Brochure entry";

  return (
    <Link
      href={`/models/view?id=${encodeURIComponent(car.id)}`}
      className="panel scanlines p-4 hover:translate-y-[-1px] transition"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-black text-lg">{title}</div>
          <div className="text-sm text-[color:var(--muted)] mt-1">{subtitle}</div>
        </div>
        <span className="badge">
          <span className="badge-dot" style={{ background: "var(--blue)" }} />
          <span>OPEN</span>
        </span>
      </div>
      <hr className="hr my-3" />
      <div className="flex flex-wrap gap-2 text-xs text-[color:var(--muted)]">
        {car.specs?.bodyType ? <span className="kbd">{car.specs.bodyType}</span> : null}
        {typeof car.priceFrom === "number" ? <span className="kbd">from {car.currency || "USD"} {car.priceFrom}</span> : null}
        {car.specs?.drivetrain ? <span className="kbd">{car.specs.drivetrain}</span> : null}
      </div>
    </Link>
  );
}

export default function ModelsPage() {
  const [q, setQ] = useState("");
  const [make, setMake] = useState("");
  const [bodyType, setBodyType] = useState("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<CarModel[]>([]);
  const [error, setError] = useState<string | null>(null);

  const numericMin = useMemo(() => (minPrice.trim() ? Number(minPrice) : undefined), [minPrice]);
  const numericMax = useMemo(() => (maxPrice.trim() ? Number(maxPrice) : undefined), [maxPrice]);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.listModels({
        q: q.trim() || undefined,
        make: make.trim() || undefined,
        bodyType: bodyType.trim() || undefined,
        minPrice: typeof numericMin === "number" && !Number.isNaN(numericMin) ? numericMin : undefined,
        maxPrice: typeof numericMax === "number" && !Number.isNaN(numericMax) ? numericMax : undefined,
      });
      setItems(data);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to load";
      setError(msg);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="surface scanlines p-6 md:p-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="h2 font-black neon">Model Index</h1>
          <p className="lead mt-2">Search, filter, and open brochure pages. Tip: press <span className="kbd">Enter</span> in search.</p>
        </div>
        <Link className="btn btn-primary" href="/compare">
          Go to Compare
        </Link>
      </div>

      <hr className="hr my-5" />

      <section className="panel p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="md:col-span-2">
            <label className="text-xs text-[color:var(--muted)]">Search</label>
            <input
              className="input mt-1"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="make, model, keyword…"
              onKeyDown={(e) => {
                if (e.key === "Enter") load();
              }}
            />
          </div>
          <div>
            <label className="text-xs text-[color:var(--muted)]">Make</label>
            <input className="input mt-1" value={make} onChange={(e) => setMake(e.target.value)} placeholder="e.g. Ford" />
          </div>
          <div>
            <label className="text-xs text-[color:var(--muted)]">Body type</label>
            <input
              className="input mt-1"
              value={bodyType}
              onChange={(e) => setBodyType(e.target.value)}
              placeholder="SUV, sedan…"
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs text-[color:var(--muted)]">Min</label>
              <input className="input mt-1" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="0" />
            </div>
            <div className="flex-1">
              <label className="text-xs text-[color:var(--muted)]">Max</label>
              <input className="input mt-1" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="99999" />
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <button className="btn btn-primary" onClick={load} disabled={loading}>
            {loading ? "Loading…" : "Search"}
          </button>
          <button
            className="btn"
            onClick={() => {
              setQ("");
              setMake("");
              setBodyType("");
              setMinPrice("");
              setMaxPrice("");
              setTimeout(load, 0);
            }}
            disabled={loading}
          >
            Reset
          </button>
        </div>

        {error ? <p className="help mt-3 text-[color:var(--red)]">{error}</p> : null}
      </section>

      <div className="mt-5">
        {items.length === 0 && !loading ? (
          <EmptyState
            title="No models found"
            description="Either the catalog is empty or the backend does not expose /models yet."
            hint="Ask the backend container to implement /models and /models/{id} endpoints, then reload."
          />
        ) : null}

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          {items.map((c) => (
            <ModelCard key={c.id} car={c} />
          ))}
        </div>
      </div>
    </div>
  );
}
