"use client";

import { motion } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function ScoreGauge({ score, band }: { score: number; band: string }) {
  const strokeColor =
    score >= 75
      ? "#16a34a"
      : score >= 50
        ? "#d97706"
        : "#dc2626";

  const bandStyle =
    score >= 75
      ? { bg: "var(--success-light)", border: "#86efac", text: "var(--success)" }
      : score >= 50
        ? { bg: "var(--warning-light)", border: "#fcd34d", text: "var(--warning)" }
        : { bg: "var(--danger-light)", border: "#fca5a5", text: "var(--danger)" };

  return (
    <div
      className="w-full p-8 rounded-xl flex flex-col items-center"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-md)",
      }}
    >
      <div className="relative w-48 h-48 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
          {/* Track */}
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="var(--border-subtle)"
            strokeWidth="12"
          />
          {/* Fill */}
          <motion.circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke={strokeColor}
            strokeWidth="12"
            strokeDasharray="502.65"
            initial={{ strokeDashoffset: 502.65 }}
            animate={{ strokeDashoffset: 502.65 - (score / 100) * 502.65 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-4xl font-bold"
            style={{ color: strokeColor }}
          >
            {score}
          </motion.span>
          <span className="text-xs font-medium mt-1" style={{ color: "var(--muted)" }}>
            Match Score
          </span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-5 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider"
        style={{
          background: bandStyle.bg,
          color: bandStyle.text,
          border: `1px solid ${bandStyle.border}`,
        }}
      >
        {band}
      </motion.div>
    </div>
  );
}
