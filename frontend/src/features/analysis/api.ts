import { AnalysisResponse } from "./types";
import axios from "axios";

export const analyzeResume = async (
  resume: File,
  jd: File,
  token: string
): Promise<AnalysisResponse> => {
  const formData = new FormData();
  formData.append("resume", resume);
  formData.append("jd", jd, jd.name);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const response = await axios.post(`${API_URL}/score`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status !== 200) {
    throw new Error("Failed to analyze. Please check your files and try again.");
  }

  return response.data;
};
