import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <div className="surface scanlines p-6 md:p-8">
      <div className="badge mb-4">
        <span className="badge-dot" style={{ background: "var(--red)" }} />
        <span>ERROR</span>
        <span className="kbd">404</span>
      </div>
      <h1 className="h2 font-black neon">Page Not Found</h1>
      <p className="lead mt-2">The page you’re looking for doesn’t exist.</p>

      <div className="mt-5 flex gap-2">
        <Link className="btn btn-primary" href="/">
          Go home
        </Link>
        <Link className="btn" href="/models">
          Browse models
        </Link>
      </div>
    </div>
  );
}
