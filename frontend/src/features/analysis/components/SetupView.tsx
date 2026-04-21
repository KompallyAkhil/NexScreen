"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, FlaskConical } from "lucide-react";
import { FileUpload } from "@/features/analysis/components/FileUpload";
import { JdInput } from "@/features/analysis/components/JdInput";

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
  const [sampleResume, setSampleResume] = useState<File | null>(null);
  const [sampleJd, setSampleJd] = useState<File | null>(null);
  const [loadingSample, setLoadingSample] = useState(false);
  const [sampleLoaded, setSampleLoaded] = useState(false);

  const loadSampleFiles = async () => {
    setLoadingSample(true);
    try {
      const [resumeRes, jdRes] = await Promise.all([
        fetch("/TCS_AkhilKompally.pdf"),
        fetch("/SoftwareDeveloperJD.pdf"),
      ]);
      const [resumeBlob, jdBlob] = await Promise.all([
        resumeRes.blob(),
        jdRes.blob(),
      ]);
      const resumeFile = new File([resumeBlob], "TCS_AkhilKompally.pdf", {
        type: "application/pdf",
      });
      const jdFile = new File([jdBlob], "SoftwareDeveloperJD.pdf", {
        type: "application/pdf",
      });
      setSampleResume(resumeFile);
      setSampleJd(jdFile);
      setResume(resumeFile);
      setJd(jdFile);
      setSampleLoaded(true);
    } catch {
      // silently fail — user can still upload manually
    } finally {
      setLoadingSample(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col items-center"
    >
      {/* Header */}
      <div className="text-center mb-10 max-w-2xl">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
          style={{
            background: "var(--accent-light)",
            color: "var(--accent)",
            border: "1px solid var(--accent-muted)",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          AI-Powered Resume Analysis
        </div>

        <h1
          className="text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-4"
          style={{ color: "var(--foreground)" }}
        >
          Match your resume to
          <br />
          <span style={{ color: "var(--accent)" }}>any job description</span>
        </h1>

        <p
          className="text-base md:text-lg leading-relaxed"
          style={{ color: "var(--muted)" }}
        >
          Upload your resume and the job description to get a semantic
          compatibility score with actionable improvement steps.
        </p>
      </div>

      {/* Upload Cards */}
      <div className="grid md:grid-cols-2 gap-5 w-full max-w-3xl mb-8">
        <FileUpload label="Resume" onFileSelect={setResume} defaultFile={sampleResume} />
        <JdInput label="Job Description" onFileSelect={setJd} defaultFile={sampleJd} />
      </div>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 px-4 py-3 rounded-lg text-sm font-medium w-full max-w-3xl"
          style={{
            background: "var(--danger-light)",
            color: "var(--danger)",
            border: "1px solid #fca5a5",
          }}
        >
          {error}
        </motion.div>
      )}

      {/* CTA row */}
      <div className="flex items-center gap-3">
        {/* Try Sample Files */}
        <button
          onClick={loadSampleFiles}
          disabled={loadingSample || sampleLoaded}
          className="flex cursor-pointer items-center justify-center gap-2.5 h-12 px-8 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: "transparent",
            color: sampleLoaded ? "var(--success)" : "var(--foreground)",
            border: `1.5px solid ${sampleLoaded ? "#86efac" : "var(--border)"}`,
          }}
          onMouseEnter={(e) => {
            if (!e.currentTarget.disabled) {
              e.currentTarget.style.borderColor = "var(--accent)";
              e.currentTarget.style.color = "var(--accent)";
            }
          }}
          onMouseLeave={(e) => {
            if (!sampleLoaded) {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.color = "var(--foreground)";
            }
          }}
        >
          {loadingSample ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Loading…
            </>
          ) : sampleLoaded ? (
            <>
              <FlaskConical size={16} />
              Samples Loaded
            </>
          ) : (
            <>
              <FlaskConical size={16} />
              Try Sample Files
            </>
          )}
        </button>

        {/* Run Analysis */}
        <button
          disabled={!resume || !jd || loading}
          onClick={handleAnalyze}
          className="flex cursor-pointer items-center justify-center gap-2.5 h-12 px-8 rounded-xl text-sm font-semibold text-white transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: "var(--accent)" }}
          onMouseEnter={(e) => {
            if (!e.currentTarget.disabled)
              e.currentTarget.style.opacity = "0.88";
          }}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Analyzing…
            </>
          ) : (
            <>
              Run Analysis
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>

      {/* Footer note */}
      <p className="mt-5 text-xs" style={{ color: "var(--muted-light)" }}>
        Resume: PDF only · JD: PDF or plain text · Max 10 MB each
      </p>
    </motion.div>
  );
}
