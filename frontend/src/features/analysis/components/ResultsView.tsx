"use client";

import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { ScoreGauge } from "./ScoreGauge";
import { SkillBadge } from "./SkillBadge";
import { InsightCard } from "./InsightCard";
import { AnalysisResponse } from "../types";

export function ResultsView({ results, reset }: { results: AnalysisResponse; reset: () => void }) {
  return (
    <motion.div 
      key="results"
      initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-12 max-w-7xl mx-auto"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 group relative z-10">
        <div className="relative">
          <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-500/20 blur-[60px] -z-10 rounded-full" />
          <h2 className="text-4xl font-black text-white tracking-tighter mb-2">Calibration Report</h2>
          <p className="text-zinc-400 text-sm font-bold tracking-widest uppercase">Generated on {new Date().toLocaleDateString()}</p>
        </div>
        <button 
          onClick={reset}
          className="flex items-center gap-3 px-6 py-3 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm font-bold hover:text-white hover:bg-zinc-800 hover:border-zinc-700 transition-all shadow-lg active:scale-95"
        >
          <RefreshCw size={16} /> New Analysis
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Visualizer Column */}
        <div className="lg:col-span-1 space-y-8 flex flex-col items-center">
          <ScoreGauge score={results.final_score} band={results.band} />
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full p-8 rounded-3xl glass backdrop-blur-xl space-y-6 relative border-t border-white/5"
          >
            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Skill Matrix</h3>
            <div className="flex flex-wrap gap-2.5">
              {results.skill_analysis?.matched_skills?.map((s: string) => (
                <SkillBadge key={s} name={s} matched={true} />
              ))}
              {results.skill_analysis?.missing_skills?.map((s: string) => (
                <SkillBadge key={s} name={s} matched={false} />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Details Column */}
        <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="md:col-span-2 p-8 rounded-3xl glass backdrop-blur-xl bg-linear-to-br from-indigo-500/10 to-transparent border border-indigo-500/10 shadow-2xl relative overflow-hidden group"
          >
            {/* Shimmer effect */}
            <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-linear-to-r from-transparent to-white opacity-5 group-hover:animate-shimmer pointer-events-none" />
            <h3 className="text-xl font-black text-white mb-4 tracking-tight">Semantic Assessment</h3>
            <p className="text-zinc-300 leading-relaxed text-lg font-medium">
              {results.llm_assessment?.reasoning}
            </p>
          </motion.div>
          
          <InsightCard 
            title="Key Strengths" 
            items={results.llm_assessment?.strengths || []} 
            type="strength" 
            delay={0.4}
          />
          <InsightCard 
            title="Identified Gaps" 
            items={results.llm_assessment?.concerns || []} 
            type="concern" 
            delay={0.5}
          />
          <div className="md:col-span-2">
            <InsightCard 
              title="Optimization Steps" 
              items={results.suggestions || []} 
              type="info" 
              delay={0.6}
            />
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="col-span-full p-8 rounded-3xl glass border border-white/5 bg-black/20"
          >
            <h3 className="text-sm font-black text-zinc-400 uppercase tracking-[0.2em] mb-8">Component Breakdown</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {Object.entries(results.components || {}).map(([key, value]: [string, any], index) => (
                <div key={key} className="space-y-3">
                  <p className="text-xs text-zinc-500 uppercase font-black tracking-wider">{key.replace('_', ' ')}</p>
                  <p className="text-3xl font-black text-white tracking-tighter">{(value.score).toFixed(1)} <span className="text-sm text-zinc-600 font-bold tracking-normal">/ 10.0</span></p>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(value.score / 10) * 100}%` }}
                      transition={{ duration: 1.5, delay: 0.8 + (index * 0.1), ease: [0.16, 1, 0.3, 1] }}
                      className="h-full bg-linear-to-r from-indigo-500 to-violet-500 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
