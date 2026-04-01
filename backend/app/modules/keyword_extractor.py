import re
from typing import List, Dict, Set
from collections import Counter

class KeywordExtractor:
    """Extract and match keywords between job description and resume"""
    
    def __init__(self):
        # Common technical skills database
        self.tech_keywords = {
            "languages": ["python", "javascript", "typescript", "java", "c++", "c#", "go", "rust", 
                         "php", "ruby", "swift", "kotlin", "scala", "r", "matlab"],
            "frontend": ["react", "vue", "angular", "svelte", "html", "css", "scss", "tailwind",
                        "bootstrap", "webpack", "vite", "npm", "yarn"],
            "backend": ["fastapi", "django", "flask", "spring", "express", "nodejs", "aspnet",
                       "rails", "laravel", "nestjs"],
            "databases": ["postgresql", "mysql", "mongodb", "firebase", "redis", "elasticsearch",
                         "cassandra", "dynamodb", "sqlserver"],
            "devops": ["docker", "kubernetes", "ci/cd", "jenkins", "github actions", "gitlab ci",
                      "aws", "gcp", "azure", "terraform", "ansible"],
            "libraries": ["tensorflow", "pytorch", "scikit-learn", "pandas", "numpy", "fastapi",
                         "sqlalchemy", "redis"]
        }
    
    def extract_keywords_from_job(self, job_description: str) -> Dict[str, List[str]]:
        """Extract all relevant keywords from job description"""
        text = job_description.lower()
        keywords = {
            "technical": [],
            "soft_skills": [],
            "tools": [],
            "frameworks": [],
            "methodologies": []
        }
        
        # Extract technical keywords
        for category, techs in self.tech_keywords.items():
            for tech in techs:
                if tech in text:
                    keywords["technical"].append(tech)
        
        # Extract soft skills
        soft_skills = ["communication", "leadership", "teamwork", "problem solving", "analytical",
                      "creative", "collaborative", "detail-oriented", "agile", "scrum"]
        for skill in soft_skills:
            if skill in text:
                keywords["soft_skills"].append(skill)
        
        # Extract years of experience patterns
        exp_pattern = r"(\d+)\+?\s*years?"
        years_found = re.findall(exp_pattern, text)
        
        return keywords
    
    def extract_text_from_resume(self, resume_text: str) -> Dict[str, str]:
        """Parse resume into sections"""
        sections = {
            "header": "",
            "summary": "",
            "experience": "",
            "skills": "",
            "education": "",
            "projects": "",
            "full_text": resume_text
        }
        
        # Simple section detection
        patterns = {
            "summary": r"(professional summary|about|objective)(.*?)(?=experience|education|skills|$)",
            "experience": r"(experience|employment)(.*?)(?=education|skills|projects|$)",
            "skills": r"(skills|technical skills|competencies)(.*?)(?=experience|education|projects|$)",
            "education": r"(education|certifications?)(.*?)(?=experience|skills|projects|$)",
        }
        
        for section, pattern in patterns.items():
            match = re.search(pattern, resume_text, re.IGNORECASE | re.DOTALL)
            if match:
                sections[section] = match.group(2) if match.lastindex >= 2 else match.group(1)
        
        return sections
    
    def calculate_keyword_match_score(
        self, 
        job_keywords: Dict[str, List[str]], 
        resume_text: str
    ) -> Dict:
        """Calculate how many job keywords are in the resume"""
        resume_lower = resume_text.lower()
        match_score = {
            "matched_keywords": [],
            "missing_keywords": [],
            "match_percentage": 0,
            "coverage_by_category": {}
        }
        
        all_keywords = []
        for category, keywords in job_keywords.items():
            all_keywords.extend(keywords)
            matched = [kw for kw in keywords if kw in resume_lower]
            match_score["coverage_by_category"][category] = {
                "matched": len(matched),
                "total": len(keywords),
                "percentage": (len(matched) / len(keywords) * 100) if keywords else 0
            }
            match_score["matched_keywords"].extend(matched)
        
        match_score["missing_keywords"] = [
            kw for kw in all_keywords if kw not in resume_lower
        ]
        
        if all_keywords:
            match_score["match_percentage"] = (len(match_score["matched_keywords"]) / len(all_keywords)) * 100
        
        return match_score
