"use client";

import { motion } from "framer-motion";
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
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      <Navbar />

      <main className="flex-1 w-full max-w-6xl mx-auto px-6 pt-28 pb-16">
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
    </div>
  );
}
