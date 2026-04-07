"use client";

import { motion } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function ScoreGauge({ score, band }: { score: number; band: string }) {
  const rotation = (score / 100) * 180 - 90;
  const color = score >= 75 ? "text-emerald-400" : score >= 50 ? "text-amber-400" : "text-rose-400";
  const strokeColor = score >= 75 ? "stroke-emerald-400" : score >= 50 ? "stroke-amber-400" : "stroke-rose-400";

  return (
    <div className="relative flex flex-col items-center justify-center p-8 rounded-3xl glass overflow-hidden shadow-2xl">
      {/* Background glow behind gauge */}
      <div className={cn("absolute inset-0 opacity-20 blur-3xl -z-10 transition-colors duration-1000", score >= 75 ? "bg-emerald-500" : score >= 50 ? "bg-amber-500" : "bg-rose-500")} />
      
      <div className="relative w-56 h-56 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90">
          {/* Track */}
          <circle
            cx="112" cy="112" r="100"
            className="fill-none stroke-zinc-800/80 drop-shadow-xl"
            strokeWidth="16"
            strokeDasharray="628.3"
            strokeDashoffset="314.15"
            strokeLinecap="round"
          />
          {/* Gauge fill */}
          <motion.circle
            cx="112" cy="112" r="100"
            initial={{ strokeDashoffset: 628.3 }}
            animate={{ strokeDashoffset: 628.3 - (score / 100) * 314.15 }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }} // smooth spring-like easing
            className={cn("fill-none drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]", strokeColor)}
            strokeWidth="16"
            strokeDasharray="628.3"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center mt-6">
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-6xl font-black tracking-tighter text-white"
          >
            {Math.round(score)}
          </motion.span>
          <span className="text-zinc-400 text-xs font-bold uppercase tracking-[0.2em] mt-1">Match Score</span>
        </div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className={cn("mt-6 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest border shadow-lg backdrop-blur-md", 
          score >= 75 ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300" : 
          score >= 50 ? "bg-amber-500/10 border-amber-500/20 text-amber-300" : 
          "bg-rose-500/10 border-rose-500/20 text-rose-300"
        )}
      >
        {band}
      </motion.div>
    </div>
  );
}
