"use client";

import { Info, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

export function InsightCard({
  title,
  items,
  type,
  delay = 0,
}: {
  title: string;
  items: string[];
  type: "strength" | "concern" | "info";
  delay?: number;
}) {
  const configs = {
    strength: {
      icon: <TrendingUp size={16} style={{ color: "var(--success)" }} />,
      iconBg: "var(--success-light)",
    },
    concern: {
      icon: <TrendingDown size={16} style={{ color: "var(--danger)" }} />,
      iconBg: "var(--danger-light)",
    },
    info: {
      icon: <Info size={16} style={{ color: "var(--accent)" }} />,
      iconBg: "var(--accent-light)",
    },
  };

  const config = configs[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="p-6 rounded-xl"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div className="flex items-center gap-2.5 mb-4">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: config.iconBg }}
        >
          {config.icon}
        </div>
        <h3
          className="text-sm font-semibold"
          style={{ color: "var(--foreground)" }}
        >
          {title}
        </h3>
      </div>

      <ul className="space-y-2.5">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex gap-3 text-sm leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            <span
              className="mt-2 h-1 w-1 rounded-full shrink-0"
              style={{ background: "var(--border)" }}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
