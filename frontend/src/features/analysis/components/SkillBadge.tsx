"use client";

import { Check, X } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function SkillBadge({
  name,
  matched,
}: {
  name: string;
  matched: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold border transition-all duration-300 drop-shadow-sm hover:-translate-y-0.5",
        matched
          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
          : "bg-zinc-800/80 border-zinc-700/80 text-zinc-400 opacity-80",
      )}
    >
      {matched ? (
        <Check size={14} className="text-emerald-400" />
      ) : (
        <X size={14} className="opacity-50" />
      )}
      {name}
    </div>
  );
}
