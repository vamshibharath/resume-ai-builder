from typing import List, Dict
from app.modules.keyword_extractor import KeywordExtractor

class ATSOptimizer:
    """Optimize resume for ATS systems"""
    
    def __init__(self):
        self.keyword_extractor = KeywordExtractor()
        self.ats_best_practices = {
            "formatting": [
                "Use standard fonts (Arial, Calibri, Times New Roman)",
                "Stick to basic formatting - avoid graphics, tables, images",
                "Use proper margins (0.5 - 1 inch)",
                "Single or 1.15 line spacing",
                "Use bullet points for easy parsing"
            ],
            "structure": [
                "Keep logical section order: Contact, Summary, Experience, Education, Skills",
                "Use clear section headings",
                "Avoid headers/footers with important info",
                "Don't nest information in columns or text boxes"
            ],
            "keywords": [
                "Mirror job description keywords",
                "Use industry-standard terminology",
                "Include full technology names (not just abbreviations)",
                "Add context keywords (e.g., 'managed team' vs just 'management')"
            ]
        }
    
    def analyze_ats_compatibility(self, resume_text: str, job_keywords: Dict) -> Dict:
        """Analyze how ATS-friendly the resume is"""
        analysis = {
            "compatibility_score": 0,
            "formatting_issues": [],
            "keyword_issues": [],
            "structure_issues": [],
            "improvements": []
        }
        
        # Check for common ATS issues
        if "<" in resume_text or ">" in resume_text:
            analysis["formatting_issues"].append("Contains HTML/XML tags")
        
        if "©" in resume_text or "®" in resume_text or "™" in resume_text:
            analysis["formatting_issues"].append("Contains special symbols that may not parse correctly")
        
        # Check keyword coverage
        keyword_match = self.keyword_extractor.calculate_keyword_match_score(
            job_keywords, resume_text
        )
        
        if keyword_match["match_percentage"] < 50:
            analysis["keyword_issues"].append(
                f"Only {keyword_match['match_percentage']:.0f}% keyword match - needs improvement"
            )
        
        # Calculate compatibility score
        max_score = 100
        keyword_score = keyword_match["match_percentage"]
        formatting_score = max(100 - len(analysis["formatting_issues"]) * 10, 0)
        
        analysis["compatibility_score"] = int((keyword_score + formatting_score) / 2)
        
        return analysis
    
    def get_optimization_recommendations(
        self, 
        resume_data: Dict, 
        job_keywords: Dict,
        job_analysis: Dict
    ) -> List[Dict]:
        """Get specific recommendations for optimization"""
        recommendations = []
        
        # Recommendation 1: Keyword placement
        keyword_match = self.keyword_extractor.calculate_keyword_match_score(
            job_keywords, 
            resume_data.get("raw_text", "")
        )
        
        if keyword_match["missing_keywords"]:
            recommendations.append({
                "type": "keyword_addition",
                "priority": "high",
                "title": "Add Missing Keywords",
                "missing_keywords": keyword_match["missing_keywords"],
                "action": f"Incorporate these {len(keyword_match['missing_keywords'])} keywords naturally into your experience and skills sections"
            })
        
        # Recommendation 2: Role title alignment
        sections = resume_data.get("sections", {})
        recommendations.append({
            "type": "role_alignment",
            "priority": "high",
            "title": "Update Role Title",
            "suggestion": f"Align your title/headline with: {job_analysis.get('job_title', 'N/A')}",
            "action": "Update your headline to match or closely match the target job title"
        })
        
        # Recommendation 3: Experience reframing
        recommendations.append({
            "type": "experience_reframe",
            "priority": "high",
            "title": "Reframe Experiences",
            "action": "Rephrase your achievements to match the job's working scenarios and required tasks"
        })
        
        # Recommendation 4: Skills section optimization
        recommendations.append({
            "type": "skills_optimization",
            "priority": "medium",
            "title": "Optimize Skills Section",
            "action": "Reorganize skills to put most relevant (matching job) skills at the top"
        })
        
        return recommendations
    
    def generate_optimization_report(
        self,
        resume_data: Dict,
        job_description: str,
        job_keywords: Dict,
        job_analysis: Dict
    ) -> Dict:
        """Generate comprehensive optimization report"""
        report = {
            "current_compatibility": self.analyze_ats_compatibility(
                resume_data.get("raw_text", ""), 
                job_keywords
            ),
            "recommendations": self.get_optimization_recommendations(
                resume_data, 
                job_keywords, 
                job_analysis
            ),
            "ats_best_practices": self.ats_best_practices
        }
        
        return report
