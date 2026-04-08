"use client";

import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { ScoreGauge } from "./ScoreGauge";
import { SkillBadge } from "./SkillBadge";
import { InsightCard } from "./InsightCard";
import { AnalysisResponse } from "../types";

export function ResultsView({
  results,
  reset,
}: {
  results: AnalysisResponse;
  reset: () => void;
}) {
  return (
    <motion.div
      key="results"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-6 max-w-6xl mx-auto"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2
            className="text-2xl font-bold tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            Analysis Report
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
            Generated on {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
        <button
          onClick={reset}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 active:scale-95"
          style={{
            background: "var(--surface)",
            color: "var(--muted)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--foreground)";
            e.currentTarget.style.borderColor = "#9ca3af";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--muted)";
            e.currentTarget.style.borderColor = "var(--border)";
          }}
        >
          <RefreshCw size={14} />
          New Analysis
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Left column */}
        <div className="lg:col-span-1 space-y-5">
          <ScoreGauge score={results.final_score} band={results.band} />

          {/* Skill Matrix */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-5 rounded-xl"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-4"
              style={{ color: "var(--muted)" }}
            >
              Skill Matrix
            </p>
            <div className="flex flex-wrap gap-2">
              {results.skill_analysis?.matched_skills?.map((s: string) => (
                <SkillBadge key={s} name={s} matched={true} />
              ))}
              {results.skill_analysis?.missing_skills?.map((s: string) => (
                <SkillBadge key={s} name={s} matched={false} />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Assessment */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="p-6 rounded-xl"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-1 h-4 rounded-full"
                style={{ background: "var(--accent)" }}
              />
              <h3
                className="text-sm font-semibold"
                style={{ color: "var(--foreground)" }}
              >
                Semantic Assessment
              </h3>
            </div>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--muted)" }}
            >
              {results.llm_assessment?.reasoning}
            </p>
          </motion.div>

          {/* Suggestions */}
          <InsightCard
            title="Optimization Steps"
            items={results.suggestions || []}
            type="info"
            delay={0.25}
          />

          {/* Component Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="p-6 rounded-xl"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-5"
              style={{ color: "var(--muted)" }}
            >
              Component Breakdown
            </p>
            <div className="grid grid-cols-2 gap-x-8 gap-y-5">
              {Object.entries(results.components || {}).map(
                ([key, value]: [string, any], index) => {
                  const score = Number(value?.score ?? 0);
                  const percentage = Math.max(0, Math.min(score, 100));
                  const color =
                    percentage >= 75
                      ? "var(--success)"
                      : percentage >= 50
                        ? "var(--warning)"
                        : "var(--danger)";

                  return (
                    <div key={`${key}-${score}`} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p
                          className="text-xs font-medium capitalize"
                          style={{ color: "var(--muted)" }}
                        >
                          {key.replace(/_/g, " ")}
                        </p>
                        <p
                          className="text-sm font-semibold"
                          style={{ color: "var(--foreground)" }}
                        >
                          {score}
                          <span
                            className="text-xs font-normal ml-0.5"
                            style={{ color: "var(--muted-light)" }}
                          >
                            /100
                          </span>
                        </p>
                      </div>
                      <div
                        className="w-full h-1.5 rounded-full overflow-hidden"
                        style={{ background: "var(--border-subtle)" }}
                      >
                        <motion.div
                          initial={{ width: "0%" }}
                          animate={{ width: `${percentage}%` }}
                          transition={{
                            duration: 1.2,
                            delay: 0.4 + index * 0.08,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="h-full rounded-full"
                          style={{ background: color }}
                        />
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
