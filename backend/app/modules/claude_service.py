import anthropic
from typing import Optional
from app.config import settings

class ClaudeService:
    """Service for Claude API interactions"""
    
    def __init__(self):
        self.client = anthropic.Anthropic(api_key=settings.anthropic_api_key)
        self.model = "claude-3-5-sonnet-20241022"
    
    def analyze_job_description(self, job_description: str) -> dict:
        """Analyze job description and extract key information"""
        prompt = f"""Analyze this job description and extract the following information in JSON format:
1. job_title: The job title/role name
2. key_responsibilities: List of main responsibilities (top 5)
3. required_skills: List of required technical and soft skills
4. preferred_skills: List of preferred/nice-to-have skills
5. years_of_experience: Required years of experience
6. company_industry: Industry/sector if mentioned
7. tech_stack: List of technologies mentioned
8. seniority_level: Junior/Mid/Senior level
9. working_scenario: Description of typical work day/projects

Job Description:
{job_description}

Return ONLY valid JSON, no markdown or extra text."""
        
        response = self.client.messages.create(
            model=self.model,
            max_tokens=1500,
            messages=[{"role": "user", "content": prompt}]
        )
        
        import json
        try:
            return json.loads(response.content[0].text)
        except json.JSONDecodeError:
            return {"raw": response.content[0].text}
    
    def get_resume_improvement_suggestions(
        self, 
        resume_text: str, 
        job_description: str, 
        job_analysis: dict
    ) -> dict:
        """Get AI suggestions for resume improvements"""
        prompt = f"""You are an expert ATS (Applicant Tracking System) optimizer and resume writer.

Given a resume and job description, provide specific improvements to match the role.

RESUME:
{resume_text}

JOB DESCRIPTION:
{job_description}

JOB ANALYSIS:
{str(job_analysis)}

Provide suggestions in JSON format:
{{
    "role_title_update": "What the resume headline/title should be",
    "key_improvements": [
        {{
            "section": "section name (e.g., Experience, Skills)",
            "original": "original text",
            "suggested": "improved text with keywords",
            "reason": "why this change helps ATS matching",
            "priority": "high/medium/low"
        }}
    ],
    "missing_keywords": ["keyword1", "keyword2"],
    "scenario_additions": [
        {{
            "bullet_point": "achievement that matches job scenario",
            "section": "where to add it"
        }}
    ],
    "ats_optimization_tips": ["tip1", "tip2"]
}}

Return ONLY valid JSON."""
        
        response = self.client.messages.create(
            model=self.model,
            max_tokens=2000,
            messages=[{"role": "user", "content": prompt}]
        )
        
        import json
        try:
            return json.loads(response.content[0].text)
        except json.JSONDecodeError:
            return {"raw": response.content[0].text}
    
    def research_company_tech_stack(self, company_name: str, industry: str) -> dict:
        """Research company tech stack and culture"""
        prompt = f"""Research the typical tech stack and technology environments for {company_name} (Industry: {industry}).
Provide in JSON format:
{{
    "likely_tech_stack": ["tech1", "tech2"],
    "cloud_platforms": ["AWS", "GCP", etc],
    "frontend_tech": ["React", "Vue", etc],
    "backend_tech": ["Python", "Java", etc],
    "databases": ["PostgreSQL", "MongoDB", etc],
    "development_practices": ["Agile", "CI/CD", etc],
    "common_tools": ["Git", "Docker", etc]
}}

Return ONLY valid JSON."""
        
        response = self.client.messages.create(
            model=self.model,
            max_tokens=1000,
            messages=[{"role": "user", "content": prompt}]
        )
        
        import json
        try:
            return json.loads(response.content[0].text)
        except json.JSONDecodeError:
            return {"raw": response.content[0].text}
