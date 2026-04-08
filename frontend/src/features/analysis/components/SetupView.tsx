"use client";

import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { FileUpload } from "@/components/ui/FileUpload";

interface SetupViewProps {
  resume: File | null;
  jd: File | null;
  setResume: (f: File | null) => void;
  setJd: (f: File | null) => void;
  loading: boolean;
  error: string | null;
  handleAnalyze: () => void;
}

export function SetupView({
  resume,
  jd,
  setResume,
  setJd,
  loading,
  error,
  handleAnalyze,
}: SetupViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center max-w-5xl mx-auto text-center"
    >
      <div className="mb-16 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none -z-10" />
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-5xl md:text-7xl font-black bg-clip-text text-transparent bg-linear-to-b from-white via-white/80 to-white/30 leading-tight tracking-tighter mb-6"
        >
          AI Resume Scoring <br />{" "}
          <span className="text-indigo-400">& Semantic Analysis</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-zinc-400 text-lg md:text-xl font-medium max-w-3xl mx-auto leading-relaxed tracking-wide"
        >
          Upload your resume and the job description to get a deep semantic
          compatibility score and actionable feedback.
        </motion.p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 w-full mb-16 px-4">
        <FileUpload label="1. UPLOAD RESUME" onFileSelect={setResume} />
        <FileUpload label="2. UPLOAD JOB DESCRIPTION" onFileSelect={setJd} />
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-semibold tracking-wide backdrop-blur-md"
        >
          {error}
        </motion.div>
      )}

      <button
        disabled={!resume || !jd || loading}
        onClick={handleAnalyze}
        className="group relative h-16 w-full md:w-72 overflow-hidden rounded-full bg-white px-8 font-black text-black text-lg transition-all hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] disabled:shadow-none tracking-wide"
      >
        <span className="relative flex items-center justify-center gap-3 group-active:scale-95 transition-transform duration-300">
          {loading ? (
            <>
              <Loader2 size={24} className="animate-spin text-indigo-600" />
              Processing...
            </>
          ) : (
            <>
              Run Analysis
              <ArrowRight
                size={24}
                className="group-hover:translate-x-2 transition-transform duration-300 text-indigo-600"
              />
            </>
          )}
        </span>
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-linear-to-r from-transparent via-black/10 to-transparent" />
      </button>
    </motion.div>
  );
}
