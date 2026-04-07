import { AnalysisResponse } from "./types";
import axios from "axios";
export const analyzeResume = async (resume: File, jd: File): Promise<AnalysisResponse> => {
  const formData = new FormData();
  formData.append("resume", resume);
  formData.append("jd", jd);

  const response = await axios.post("http://127.0.0.1:8000/score", formData);

  if (response.status !== 200) {
    throw new Error("Failed to analyze files. Please ensure both are PDFs.");
  }
  console.log(response.data);
  return response.data;
};
