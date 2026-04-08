"use client";

import { Check, X } from "lucide-react";

export function SkillBadge({
  name,
  matched,
}: {
  name: string;
  matched: boolean;
}) {
  return (
    <div
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-150"
      style={
        matched
          ? {
              background: "var(--success-light)",
              color: "var(--success)",
              border: "1px solid #86efac",
            }
          : {
              background: "var(--border-subtle)",
              color: "var(--muted)",
              border: "1px solid var(--border)",
            }
      }
    >
      {matched ? (
        <Check size={11} style={{ color: "var(--success)" }} />
      ) : (
        <X size={11} style={{ color: "var(--muted-light)" }} />
      )}
      {name}
    </div>
  );
}
