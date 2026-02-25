"use client";

import EmptyState from "@/components/EmptyState";
import { api } from "@/lib/api";
import type { CarModel } from "@/lib/types";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";

type Draft = Partial<CarModel> & { id?: string };

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-start">
      <div className="text-xs text-[color:var(--muted)] pt-2">{label}</div>
      <div className="md:col-span-2">{children}</div>
    </div>
  );
}

export default function AdminPage() {
  const [items, setItems] = useState<CarModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const [draft, setDraft] = useState<Draft>({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    tagline: "",
    priceFrom: undefined,
    currency: "USD",
    heroImageUrl: "",
  });

  const editing = useMemo(() => Boolean(draft.id), [draft.id]);

  async function refresh() {
    setLoading(true);
    setError("");
    try {
      const data = await api.adminListModels();
      setItems(data);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to load admin data";
      setError(msg);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function save() {
    setLoading(true);
    setError("");
    const res = await api.adminUpsertModel(draft);
    if (!res.ok) {
      setError(res.error);
      setLoading(false);
      return;
    }
    setDraft({ make: "", model: "", year: new Date().getFullYear(), tagline: "", currency: "USD", heroImageUrl: "" });
    await refresh();
  }

  async function remove(id: string) {
    if (!confirm("Delete this model?")) return;
    setLoading(true);
    setError("");
    const res = await api.adminDeleteModel(id);
    if (!res.ok) setError(res.error);
    await refresh();
  }

  return (
    <div className="surface scanlines p-6 md:p-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="h2 font-black neon">Admin Console</h1>
          <p className="lead mt-2">CRUD for models (requires backend admin endpoints).</p>
        </div>
        <div className="flex gap-2">
          <Link className="btn" href="/models">
            View site
          </Link>
          <button className="btn btn-primary" onClick={refresh} disabled={loading}>
            Refresh
          </button>
        </div>
      </div>

      <hr className="hr my-5" />

      {error ? <p className="help text-[color:var(--red)] mb-3">{error}</p> : null}

      <div className="grid-2">
        <section className="panel p-5">
          <div className="text-sm font-black">{editing ? "Edit model" : "Create model"}</div>
          <p className="help mt-2">
            Expected endpoints: <span className="kbd">GET /admin/models</span>, <span className="kbd">POST /admin/models</span>,{" "}
            <span className="kbd">PUT /admin/models/:id</span>, <span className="kbd">DELETE /admin/models/:id</span>.
          </p>

          <div className="mt-4 flex flex-col gap-3">
            <Row label="Make">
              <input className="input" value={draft.make || ""} onChange={(e) => setDraft((d) => ({ ...d, make: e.target.value }))} />
            </Row>
            <Row label="Model">
              <input className="input" value={draft.model || ""} onChange={(e) => setDraft((d) => ({ ...d, model: e.target.value }))} />
            </Row>
            <Row label="Year">
              <input
                className="input"
                value={draft.year ?? ""}
                onChange={(e) => setDraft((d) => ({ ...d, year: e.target.value ? Number(e.target.value) : undefined }))}
                inputMode="numeric"
              />
            </Row>
            <Row label="Tagline">
              <input
                className="input"
                value={draft.tagline || ""}
                onChange={(e) => setDraft((d) => ({ ...d, tagline: e.target.value }))}
                placeholder="Short brochure line"
              />
            </Row>
            <Row label="Price from">
              <input
                className="input"
                value={typeof draft.priceFrom === "number" ? String(draft.priceFrom) : ""}
                onChange={(e) => setDraft((d) => ({ ...d, priceFrom: e.target.value ? Number(e.target.value) : undefined }))}
                inputMode="numeric"
              />
            </Row>
            <Row label="Currency">
              <input
                className="input"
                value={draft.currency || "USD"}
                onChange={(e) => setDraft((d) => ({ ...d, currency: e.target.value }))}
              />
            </Row>
            <Row label="Hero image URL">
              <input
                className="input"
                value={draft.heroImageUrl || ""}
                onChange={(e) => setDraft((d) => ({ ...d, heroImageUrl: e.target.value }))}
                placeholder="https://…"
              />
            </Row>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button className="btn btn-primary" onClick={save} disabled={loading || !draft.make || !draft.model}>
              {loading ? "Saving…" : editing ? "Save changes" : "Create model"}
            </button>
            <button
              className="btn"
              onClick={() =>
                setDraft({ make: "", model: "", year: new Date().getFullYear(), tagline: "", currency: "USD", heroImageUrl: "" })
              }
              disabled={loading}
            >
              Clear
            </button>
          </div>
        </section>

        <aside className="panel p-5">
          <div className="text-sm font-black">Models</div>
          <hr className="hr my-3" />

          {items.length === 0 && !loading ? (
            <EmptyState
              title="No admin data"
              description="Either there are no models yet, or /admin/models is not implemented."
              hint="Implement backend admin endpoints, then refresh."
            />
          ) : null}

          <div className="flex flex-col gap-2">
            {items.map((m) => (
              <div key={m.id} className="panel p-3 bg-[rgba(11,16,32,.35)]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-bold">
                      {m.make} {m.model}
                    </div>
                    <div className="text-xs text-[color:var(--muted)]">{m.year ?? "—"}</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="btn"
                      onClick={() =>
                        setDraft({
                          id: m.id,
                          make: m.make,
                          model: m.model,
                          year: m.year ?? undefined,
                          tagline: m.tagline ?? "",
                          priceFrom: m.priceFrom ?? undefined,
                          currency: m.currency ?? "USD",
                          heroImageUrl: m.heroImageUrl ?? "",
                        })
                      }
                    >
                      Edit
                    </button>
                    <button className="btn btn-danger" onClick={() => remove(m.id)}>
                      Delete
                    </button>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Link className="badge" href={`/models/view?id=${encodeURIComponent(m.id)}`}>
                    <span className="badge-dot" style={{ background: "var(--cyan)" }} />
                    <span>Open brochure</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
