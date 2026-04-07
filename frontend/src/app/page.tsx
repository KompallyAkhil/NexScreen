"use client";

import { AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { SetupView } from "@/features/analysis/components/SetupView";
import { ResultsView } from "@/features/analysis/components/ResultsView";
import { useAnalysis } from "@/features/analysis/useAnalysis";

export default function Home() {
  const {
    resume,
    setResume,
    jd,
    setJd,
    loading,
    results,
    error,
    handleAnalyze,
    reset,
  } = useAnalysis();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      <Navbar />

      <main className="flex-1 w-full px-6 py-32 relative z-10">
        <AnimatePresence mode="wait">
          {!results ? (
            <SetupView
              key="setup"
              resume={resume}
              setResume={setResume}
              jd={jd}
              setJd={setJd}
              loading={loading}
              error={error}
              handleAnalyze={handleAnalyze}
            />
          ) : (
            <ResultsView key="results" results={results} reset={reset} />
          )}
        </AnimatePresence>
      </main>

      {/* Global Background Decor */}
      <div className="fixed top-[-20%] right-[-10%] w-[70vw] h-[70vw] bg-indigo-900/10 blur-[150px] rounded-full -z-10 pointer-events-none" />
      <div className="fixed bottom-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-violet-900/10 blur-[150px] rounded-full -z-10 pointer-events-none" />

      {/* Subtle Grain Overlay */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none -z-10"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=%220 0 1024 1024%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
        }}
      />
    </div>
  );
}
