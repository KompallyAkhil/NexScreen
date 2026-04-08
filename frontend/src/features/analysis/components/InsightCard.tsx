"use client";

import { Info, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
      icon: <TrendingUp className="text-emerald-400" size={22} />,
      gradient: "from-emerald-500/10",
    },
    concern: {
      icon: <TrendingDown className="text-rose-400" size={22} />,
      gradient: "from-rose-500/10",
    },
    info: {
      icon: <Info className="text-indigo-400" size={22} />,
      gradient: "from-indigo-500/10",
    },
  };

  const config = configs[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={twMerge(
        "p-6 rounded-3xl glass backdrop-blur-xl relative overflow-hidden group hover:border-white/20 transition-all duration-500",
        `bg-linear-to-br ${config.gradient} to-transparent`,
      )}
    >
      {/* Glossy sheen overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-white/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="flex items-center gap-3 mb-5 relative z-10">
        <div className="p-2 rounded-xl bg-black/40 backdrop-blur-md shadow-inner border border-white/5">
          {config.icon}
        </div>
        <h3 className="font-bold text-lg tracking-tight text-white/90">
          {title}
        </h3>
      </div>

      <ul className="space-y-4 relative z-10">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex gap-4 text-sm text-zinc-300/90 leading-relaxed items-start"
          >
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-white/30 shrink-0 shadow-[0_0_5px_rgba(255,255,255,0.5)]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
