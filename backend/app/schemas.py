from pydantic import BaseModel
from typing import List, Optional, Dict

# Request models
class ResumeAnalysisRequest(BaseModel):
    resume_text: str
    job_description: str
    company_name: Optional[str] = None

class ResumeParsing(BaseModel):
    resume_text: str

# Response models  
class KeywordMatch(BaseModel):
    matched_keywords: List[str]
    missing_keywords: List[str]
    match_percentage: float

class OptimizationSuggestion(BaseModel):
    section: str
    original: str
    suggested: str
    reason: str
    priority: str

class AnalysisResponse(BaseModel):
    job_analysis: Dict
    keyword_match: Dict
    ats_compatibility: Dict
    optimization_report: Dict
    
class ResumeImprovementResponse(BaseModel):
    improvements: List[OptimizationSuggestion]
    missing_keywords: List[str]
    priority_changes: List[Dict]
