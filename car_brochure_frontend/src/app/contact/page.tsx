"use client";

import EmptyState from "@/components/EmptyState";
import { api } from "@/lib/api";
import type { LeadPayload } from "@/lib/types";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useMemo, useState } from "react";

function ContactInner() {
  const sp = useSearchParams();
  const modelId = useMemo(() => sp.get("modelId") || "", [sp]);

  const [form, setForm] = useState<LeadPayload>({
    name: "",
    email: "",
    phone: "",
    message: "",
    modelId: modelId || undefined,
  });

  // Keep modelId in sync if query changes after hydration/navigation.
  useEffect(() => {
    setForm((f) => ({ ...f, modelId: modelId || undefined }));
  }, [modelId]);

  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string>("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");

    const res = await api.submitLead({
      ...form,
      modelId: form.modelId?.trim() ? form.modelId.trim() : undefined,
      phone: form.phone?.trim() ? form.phone.trim() : undefined,
    });

    if (res.ok) {
      setStatus("sent");
    } else {
      setStatus("error");
      setError(res.error);
    }
  }

  return (
    <div className="surface scanlines p-6 md:p-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="h2 font-black neon">Contact / Lead</h1>
          <p className="lead mt-2">Send an inquiry. This will POST to the backend lead endpoint when available.</p>
        </div>
        <Link className="btn" href="/models">
          Browse models
        </Link>
      </div>

      <hr className="hr my-5" />

      {status === "sent" ? (
        <div>
          <div className="panel p-5">
            <div className="text-lg font-black text-[color:var(--green)]">Lead sent</div>
            <p className="lead mt-2">We’ll get back to you soon. You can send another message below.</p>
          </div>
          <div className="mt-3">
            <button
              className="btn btn-primary"
              onClick={() => {
                setStatus("idle");
                setForm((f) => ({ ...f, message: "" }));
              }}
            >
              Send another
            </button>
          </div>
        </div>
      ) : null}

      <div className="grid-2 mt-4">
        <form className="panel p-5" onSubmit={submit}>
          <div className="text-sm font-black">Inquiry form</div>
          <p className="help mt-2">Required fields: name, email, message.</p>

          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[color:var(--muted)]">Name</label>
              <input
                className="input mt-1"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="text-xs text-[color:var(--muted)]">Email</label>
              <input
                className="input mt-1"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                type="email"
                required
              />
            </div>
            <div>
              <label className="text-xs text-[color:var(--muted)]">Phone (optional)</label>
              <input
                className="input mt-1"
                value={form.phone || ""}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-xs text-[color:var(--muted)]">Model ID (optional)</label>
              <input
                className="input mt-1"
                value={form.modelId || ""}
                onChange={(e) => setForm((f) => ({ ...f, modelId: e.target.value }))}
                placeholder="auto-filled if coming from a model page"
              />
            </div>
          </div>

          <div className="mt-3">
            <label className="text-xs text-[color:var(--muted)]">Message</label>
            <textarea
              className="textarea mt-1 min-h-[140px]"
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              required
            />
          </div>

          {status === "error" ? <p className="help mt-3 text-[color:var(--red)]">{error}</p> : null}

          <div className="mt-4 flex gap-2">
            <button className="btn btn-primary" disabled={status === "sending"}>
              {status === "sending" ? "Sending…" : "Send lead"}
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => {
                setForm({ name: "", email: "", phone: "", message: "", modelId: modelId || undefined });
                setStatus("idle");
                setError("");
              }}
              disabled={status === "sending"}
            >
              Reset
            </button>
          </div>
        </form>

        <aside className="panel p-5">
          <div className="text-sm font-black">What happens next?</div>
          <hr className="hr my-3" />
          <ul className="help list-disc pl-4 space-y-2">
            <li>Your inquiry is sent to the backend lead endpoint.</li>
            <li>Admin can review and respond (backend + admin UI integration).</li>
            <li>If backend endpoints are missing, you’ll see an error message.</li>
          </ul>

          <div className="mt-4">
            <EmptyState
              title="Backend endpoint required"
              description="This form expects POST /leads (or similar)."
              hint="If you see 404, implement lead submission endpoint in backend."
            />
          </div>
        </aside>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
export default function ContactPage() {
  /** Contact page wrapper that provides a Suspense boundary required for useSearchParams() during static export. */
  return (
    <Suspense
      fallback={
        <div className="surface scanlines p-6 md:p-8">
          <div className="h2 font-black neon">Loading…</div>
          <p className="lead mt-2">Preparing contact form.</p>
        </div>
      }
    >
      <ContactInner />
    </Suspense>
  );
}
