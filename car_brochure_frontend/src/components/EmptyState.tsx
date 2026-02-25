import React from "react";

export default function EmptyState({
  title,
  description,
  hint,
}: {
  title: string;
  description?: string;
  hint?: string;
}) {
  return (
    <div className="panel scanlines p-5">
      <div className="badge mb-3">
        <span className="badge-dot" />
        <span>STATUS</span>
      </div>
      <div className="text-lg font-black">{title}</div>
      {description ? <p className="lead mt-2">{description}</p> : null}
      {hint ? (
        <p className="help mt-3">
          <span className="font-semibold text-[color:var(--text)]">Hint:</span> {hint}
        </p>
      ) : null}
    </div>
  );
}
