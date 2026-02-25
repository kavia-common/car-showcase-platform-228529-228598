"use client";

import EmptyState from "@/components/EmptyState";
import { api } from "@/lib/api";
import type { CarModel } from "@/lib/types";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useMemo, useState } from "react";

function SpecRow({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-[rgba(231,240,255,.10)]">
      <div className="text-sm text-[color:var(--muted)]">{label}</div>
      <div className="text-sm font-semibold">{value ?? "—"}</div>
    </div>
  );
}

function ModelViewInner() {
  const sp = useSearchParams();
  const id = useMemo(() => sp.get("id") || "", [sp]);

  const [car, setCar] = useState<CarModel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    if (!id) {
      setCar(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    api
      .getModel(id)
      .then((c) => {
        if (alive) setCar(c);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [id]);

  const title = useMemo(() => (car ? `${car.make} ${car.model}` : "Model"), [car]);

  if (!id) {
    return (
      <div className="surface scanlines p-6 md:p-8">
        <EmptyState
          title="No model selected"
          description="This export-safe viewer expects a model id in the query string."
          hint="Example: /models/view?id=model-123"
        />
        <div className="mt-4">
          <Link className="btn btn-primary" href="/models">
            Back to models
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="surface scanlines p-6 md:p-8">
        <div className="h2 font-black neon">Loading…</div>
        <p className="lead mt-2">Fetching brochure data.</p>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="surface scanlines p-6 md:p-8">
        <EmptyState
          title="Model not available"
          description="This model does not exist, or the backend endpoint /models/{id} is not available yet."
          hint="Return to Model Index and try again after backend is implemented."
        />
        <div className="mt-4 flex gap-2">
          <Link className="btn btn-primary" href="/models">
            Back to models
          </Link>
        </div>
      </div>
    );
  }

  const imgs = car.images || (car.heroImageUrl ? [{ id: "hero", url: car.heroImageUrl, alt: title }] : []);
  const compareLink = `/compare?ids=${encodeURIComponent(car.id)}`;

  return (
    <div className="surface scanlines p-6 md:p-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="badge">
            <span className="badge-dot" style={{ background: "var(--cyan)" }} />
            <span>BROCHURE</span>
          </div>
          <h1 className="h2 font-black neon mt-3">{title}</h1>
          <p className="lead mt-2">{car.tagline || "Specs • Trims • Gallery"}</p>
        </div>
        <div className="flex gap-2">
          <Link className="btn" href="/models">
            Model index
          </Link>
          <Link className="btn btn-primary" href={compareLink}>
            Compare
          </Link>
        </div>
      </div>

      <hr className="hr my-5" />

      <div className="grid-2">
        <section className="panel p-4">
          <div className="text-sm font-black">Gallery</div>
          <p className="help mt-1">Static export safe: uses simple image blocks.</p>

          <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2">
            {imgs.length === 0 ? (
              <div className="col-span-2 md:col-span-3">
                <EmptyState title="No images" description="Add images via admin once backend supports it." />
              </div>
            ) : (
              imgs.map((img) => (
                <div
                  key={img.id}
                  className="rounded-2xl border border-[rgba(231,240,255,.12)] bg-[rgba(11,16,32,.4)] overflow-hidden"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt={img.alt || title} className="w-full h-40 object-cover" />
                </div>
              ))
            )}
          </div>
        </section>

        <aside className="panel p-4">
          <div className="text-sm font-black">Specs</div>
          <div className="mt-3">
            <SpecRow label="Year" value={car.year} />
            <SpecRow label="Body type" value={car.specs?.bodyType} />
            <SpecRow label="Drivetrain" value={car.specs?.drivetrain} />
            <SpecRow label="Transmission" value={car.specs?.transmission} />
            <SpecRow label="Horsepower" value={car.specs?.horsepower} />
            <SpecRow label="Torque" value={car.specs?.torque} />
            <SpecRow label="0–60" value={car.specs?.zeroToSixty ? `${car.specs?.zeroToSixty}s` : null} />
            <SpecRow label="Range" value={car.specs?.rangeMiles ? `${car.specs?.rangeMiles} mi` : null} />
            <SpecRow
              label="Price from"
              value={typeof car.priceFrom === "number" ? `${car.currency || "USD"} ${car.priceFrom}` : null}
            />
          </div>
        </aside>
      </div>

      <div className="mt-5 grid-3">
        <section className="panel p-4">
          <div className="text-sm font-black">Trims & Pricing</div>
          <hr className="hr my-3" />
          {(car.trims || []).length === 0 ? (
            <p className="help">No trims listed yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {car.trims!.map((t) => (
                <div key={t.id} className="panel p-3 bg-[rgba(11,16,32,.35)]">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-bold">{t.name}</div>
                    <div className="text-sm text-[color:var(--muted)]">
                      {typeof t.msrp === "number" ? `${t.currency || car.currency || "USD"} ${t.msrp}` : "—"}
                    </div>
                  </div>
                  {t.highlights?.length ? (
                    <ul className="help mt-2 list-disc pl-4">
                      {t.highlights.slice(0, 4).map((h, idx) => (
                        <li key={idx}>{h}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="panel p-4 md:col-span-2">
          <div className="text-sm font-black">Features</div>
          <hr className="hr my-3" />
          {(car.features || []).length === 0 ? (
            <p className="help">No feature list available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {car.features!.map((f, idx) => (
                <div key={idx} className="badge">
                  <span className="badge-dot" style={{ background: "var(--pink)" }} />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <Link className="btn btn-primary" href={`/contact?modelId=${encodeURIComponent(car.id)}`}>
              Request info
            </Link>
            <Link className="btn" href={compareLink}>
              Add to compare
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
export default function ModelViewPage() {
  /** Model view wrapper that provides a Suspense boundary required for useSearchParams() during static export. */
  return (
    <Suspense
      fallback={
        <div className="surface scanlines p-6 md:p-8">
          <div className="h2 font-black neon">Loading…</div>
          <p className="lead mt-2">Preparing model viewer.</p>
        </div>
      }
    >
      <ModelViewInner />
    </Suspense>
  );
}
