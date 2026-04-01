import re
from typing import List, Dict

class ResumeParser:
    """Parse and extract information from resumes"""
    
    def parse_resume_text(self, text: str) -> Dict:
        """Parse resume from text and extract structured data"""
        resume_data = {
            "raw_text": text,
            "sections": self._extract_sections(text),
            "contact_info": self._extract_contact_info(text),
            "current_role": self._extract_current_role(text),
            "years_of_experience": self._calculate_experience(text)
        }
        return resume_data
    
    def _extract_sections(self, text: str) -> Dict[str, str]:
        """Extract resume sections"""
        sections = {}
        
        # Define section patterns
        section_patterns = {
            "professional_summary": r"(professional summary|about|objective|summary)(.*?)(?=experience|education|skills|projects|certifications|$)",
            "experience": r"(work experience|employment|career|experience)(.*?)(?=education|skills|projects|certifications|$)",
            "education": r"(education|academic)(.*?)(?=experience|skills|projects|certifications|$)",
            "skills": r"(technical skills|skills|competencies|core competencies)(.*?)(?=experience|education|projects|certifications|$)",
            "projects": r"(projects|portfolio|case studies)(.*?)(?=experience|education|skills|certifications|$)",
            "certifications": r"(certifications?|licenses?|credentials)(.*?)(?=$)",
        }
        
        for section_name, pattern in section_patterns.items():
            match = re.search(pattern, text, re.IGNORECASE | re.DOTALL)
            if match:
                sections[section_name] = match.group(2).strip() if match.lastindex >= 2 else match.group(1).strip()
        
        return sections
    
    def _extract_contact_info(self, text: str) -> Dict:
        """Extract contact information"""
        contact_info = {}
        
        # Email pattern
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(email_pattern, text)
        if emails:
            contact_info["email"] = emails[0]
        
        # Phone pattern
        phone_pattern = r'\b(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})\b'
        phones = re.findall(phone_pattern, text)
        if phones:
            contact_info["phone"] = f"({phones[0][0]}) {phones[0][1]}-{phones[0][2]}"
        
        # LinkedIn
        linkedin_pattern = r'linkedin\.com/in/[^\s]+'
        linkedin = re.search(linkedin_pattern, text, re.IGNORECASE)
        if linkedin:
            contact_info["linkedin"] = linkedin.group(0)
        
        # GitHub
        github_pattern = r'github\.com/[^\s]+'
        github = re.search(github_pattern, text, re.IGNORECASE)
        if github:
            contact_info["github"] = github.group(0)
        
        return contact_info
    
    def _extract_current_role(self, text: str) -> str:
        """Extract current job title from resume"""
        # Look for job titles near the beginning
        lines = text.split('\n')
        for i, line in enumerate(lines[:20]):  # Check first 20 lines
            if any(title in line.lower() for title in 
                   ["engineer", "developer", "manager", "analyst", "architect", "lead", "director"]):
                return line.strip()
        return ""
    
    def _calculate_experience(self, text: str) -> int:
        """Calculate total years of experience"""
        # Pattern to find years
        patterns = [
            r"(\d+)\+?\s*years?\s*(?:of\s+)?experience",
            r"(\d+)\s*(?:to|–|-|~)\s*(\d+)\s*(?:\((\d+)\s*years?\))?",
        ]
        
        years = []
        for pattern in patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches:
                if isinstance(match, tuple):
                    try:
                        if len(match) >= 2:
                            start_year = int(match[0])
                            end_year = int(match[1])
                            years.append(end_year - start_year)
                        elif match[0].isdigit():
                            years.append(int(match[0]))
                    except ValueError:
                        pass
                else:
                    try:
                        years.append(int(match))
                    except ValueError:
                        pass
        
        return max(years) if years else 0
    
    def extract_from_pdf(self, pdf_path: str) -> str:
        """Extract text from PDF resume"""
        try:
            from pypdf import PdfReader
            reader = PdfReader(pdf_path)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
            return text
        except ImportError:
            return ""
    
    def extract_from_docx(self, docx_path: str) -> str:
        """Extract text from DOCX resume"""
        try:
            from docx import Document
            doc = Document(docx_path)
            text = ""
            for para in doc.paragraphs:
                text += para.text + "\n"
            return text
        except ImportError:
            return ""
