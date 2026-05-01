import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { AnalysisResponse } from "./types";
import { analyzeResume } from "./api";

export function useAnalysis() {
  const { isSignedIn, getToken } = useAuth();

  const [resume, setResume] = useState<File | null>(null);
  const [jd, setJd] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!resume || !jd) return;

    if (!isSignedIn) {
      setError("You must be signed in to analyze a resume.");
      return;
    }
    
    const token = await getToken();
    if (!token) {
      setError("Could not retrieve authentication token. Please sign in again.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await analyzeResume(resume, jd, token);
      setResults(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResults(null);
    setResume(null);
    setJd(null);
    setError(null);
  };

  return {
    resume,
    setResume,
    jd,
    setJd,
    loading,
    results,
    error,
    handleAnalyze,
    reset,
    isSignedIn,
  };
}
