"use client";

import { motion } from "framer-motion";
import { Sparkles, MessageCircle, FileCode, Command } from "lucide-react";

export function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-6xl px-6"
    >
      <div className="flex items-center justify-between h-16 px-6 lg:px-8 rounded-full bg-black/40 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]">
        {/* Brand */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
            <Sparkles size={18} className="text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white">
            NexScreen
          </span>
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#"
            className="text-sm font-bold text-zinc-400 hover:text-white transition-colors flex items-center gap-2 tracking-wide group"
          >
            <FileCode
              size={16}
              className="group-hover:text-indigo-400 transition-colors"
            />{" "}
            Source
          </a>
        </div>

        {/* Action */}
        <div className="flex items-center gap-4">
          <button className="hidden sm:block text-sm font-bold text-zinc-300 hover:text-white tracking-wide transition-all">
            Login
          </button>
          <button className="px-6 py-2.5 rounded-full bg-white text-black text-sm font-black hover:bg-zinc-200 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)] tracking-wide">
            Get Started
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
