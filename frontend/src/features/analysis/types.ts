export interface SkillAnalysis {
  matched_skills: string[];
  missing_skills: string[];
}

export interface LLMAssessment {
  reasoning: string;
  strengths: string[];
  concerns: string[];
}

export interface ComponentScore {
  score: number;
  reasoning?: string;
}

export interface AnalysisResponse {
  final_score: number;
  band: string;
  skill_analysis: SkillAnalysis;
  llm_assessment: LLMAssessment;
  suggestions: string[];
  components: Record<string, ComponentScore>;
}
