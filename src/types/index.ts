export interface ResumeOptimizationRequest {
  jobDescription: string;
  resumeText: string;
  companyName?: string;
}

export interface KeywordAnalysis {
  keyword: string;
  found: boolean;
  context?: string;
}

export interface JobAnalysis {
  detectedRole: string;
  requiredSkills: string[];
  techStack: string[];
  companyName: string;
  seniorityLevel: string;
  keyResponsibilities: string[];
  atsKeywords: string[];
}

export interface OptimizationResult {
  jobAnalysis: JobAnalysis;
  optimizedResume: string;
  keywordCoverage: number;
  keywordAnalysis: KeywordAnalysis[];
  atsScore: number;
  improvements: string[];
  scenarioPoints: string[];
}
