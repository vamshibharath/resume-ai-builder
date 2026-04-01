from fastapi import FastAPI, UploadFile, File, Form, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
import logging
from typing import Optional
import json

from app.config import settings
from app.modules.resume_parser import ResumeParser
from app.modules.keyword_extractor import KeywordExtractor
from app.modules.ats_optimizer import ATSOptimizer
from app.modules.claude_service import ClaudeService
from app.schemas import ResumeAnalysisRequest, AnalysisResponse

# Initialize FastAPI
app = FastAPI(
    title="Resume AI Builder",
    description="Advanced AI-powered resume builder for ATS optimization",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
resume_parser = ResumeParser()
keyword_extractor = KeywordExtractor()
ats_optimizer = ATSOptimizer()
claude_service = ClaudeService()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ==================== HEALTH CHECK ====================
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "Resume AI Builder"}

# ==================== ANALYSIS ENDPOINTS ====================
@app.post("/api/analyze")
async def analyze_resume(request: ResumeAnalysisRequest):
    """
    Main endpoint: Analyze resume against job description
    
    Returns:
    - Job analysis (title, responsibilities, skills, tech stack, etc.)
    - Keyword matching results
    - ATS compatibility score
    - Specific recommendations
    """
    try:
        logger.info("Starting resume analysis...")
        
        # Parse resume
        resume_data = resume_parser.parse_resume_text(request.resume_text)
        logger.info(f"Resume parsed. Current role: {resume_data.get('current_role')}")
        
        # Analyze job description with Claude
        job_analysis = claude_service.analyze_job_description(request.job_description)
        logger.info(f"Job analyzed: {job_analysis.get('job_title', 'Unknown')}")
        
        # Extract keywords
        job_keywords = keyword_extractor.extract_keywords_from_job(request.job_description)
        
        # Calculate keyword match
        keyword_match = keyword_extractor.calculate_keyword_match_score(
            job_keywords,
            request.resume_text
        )
        logger.info(f"Keyword match score: {keyword_match['match_percentage']:.1f}%")
        
        # ATS optimization analysis
        ats_analysis = ats_optimizer.analyze_ats_compatibility(
            request.resume_text,
            job_keywords
        )
        
        # Get Claude suggestions for improvement
        improvements = claude_service.get_resume_improvement_suggestions(
            request.resume_text,
            request.job_description,
            job_analysis
        )
        
        # Generate full optimization report
        optimization_report = ats_optimizer.generate_optimization_report(
            resume_data,
            request.job_description,
            job_keywords,
            job_analysis
        )
        
        # Research company if provided
        company_techstack = {}
        if request.company_name:
            industry = job_analysis.get("company_industry", "Technology")
            company_techstack = claude_service.research_company_tech_stack(
                request.company_name,
                industry
            )
            logger.info(f"Company research completed for {request.company_name}")
        
        response = {
            "success": True,
            "job_analysis": job_analysis,
            "resume_data": {
                "current_role": resume_data.get("current_role"),
                "years_of_experience": resume_data.get("years_of_experience"),
                "contact_info": resume_data.get("contact_info")
            },
            "keyword_match": {
                "matched_count": len(keyword_match["matched_keywords"]),
                "total_keywords": len(keyword_match["matched_keywords"]) + len(keyword_match["missing_keywords"]),
                "match_percentage": keyword_match["match_percentage"],
                "matched_keywords": keyword_match["matched_keywords"][:20],  # Top 20
                "missing_keywords": keyword_match["missing_keywords"]
            },
            "ats_compatibility": ats_analysis,
            "improvements": improvements,
            "company_techstack": company_techstack,
            "optimization_report": optimization_report
        }
        
        return response
        
    except Exception as e:
        logger.error(f"Error analyzing resume: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# ==================== FILE UPLOAD ENDPOINTS ====================
@app.post("/api/upload/resume")
async def upload_resume(file: UploadFile = File(...)):
    """Upload and parse resume file (PDF or DOCX)"""
    try:
        content = await file.read()
        
        # Determine file type and extract text
        if file.filename.endswith(".pdf"):
            # For now, store and return info about PDF
            resume_text = f"PDF file uploaded: {file.filename} ({len(content)} bytes)"
        elif file.filename.endswith(".docx"):
            resume_text = f"DOCX file uploaded: {file.filename} ({len(content)} bytes)"
        else:
            raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")
        
        return {
            "success": True,
            "filename": file.filename,
            "size": len(content),
            "message": "File uploaded successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ==================== OPTIMIZATION ENDPOINTS ====================
@app.post("/api/optimize")
async def optimize_resume(request: ResumeAnalysisRequest):
    """
    Get AI-powered optimization suggestions
    """
    try:
        # First analyze
        job_analysis = claude_service.analyze_job_description(request.job_description)
        
        # Get improvement suggestions
        suggestions = claude_service.get_resume_improvement_suggestions(
            request.resume_text,
            request.job_description,
            job_analysis
        )
        
        return {
            "success": True,
            "job_title": job_analysis.get("job_title"),
            "suggestions": suggestions
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==================== KEYWORD ENDPOINTS ====================
@app.post("/api/keywords/extract")
async def extract_keywords(job_description: str = Form(...)):
    """Extract keywords from job description"""
    try:
        keywords = keyword_extractor.extract_keywords_from_job(job_description)
        
        all_keywords = []
        for category, kws in keywords.items():
            all_keywords.extend(kws)
        
        return {
            "success": True,
            "keywords_by_category": keywords,
            "total_keywords": len(set(all_keywords)),
            "all_keywords": list(set(all_keywords))
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/keywords/match")
async def match_keywords(
    resume_text: str = Form(...),
    job_keywords_json: str = Form(...)
):
    """Match resume against specific keywords"""
    try:
        job_keywords = json.loads(job_keywords_json)
        match = keyword_extractor.calculate_keyword_match_score(job_keywords, resume_text)
        
        return {
            "success": True,
            "match_score": match
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ==================== RESUME PARSING ENDPOINTS ====================
@app.post("/api/parse")
async def parse_resume(resume_text: str = Form(...)):
    """Parse resume and extract structured information"""
    try:
        resume_data = resume_parser.parse_resume_text(resume_text)
        
        return {
            "success": True,
            "current_role": resume_data.get("current_role"),
            "years_of_experience": resume_data.get("years_of_experience"),
            "contact_info": resume_data.get("contact_info"),
            "sections": list(resume_data.get("sections", {}).keys())
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ==================== COMPANY RESEARCH ENDPOINTS ====================
@app.post("/api/company/research")
async def research_company(company_name: str = Form(...), industry: str = Form(...)):
    """Research company tech stack and environment"""
    try:
        techstack = claude_service.research_company_tech_stack(company_name, industry)
        
        return {
            "success": True,
            "company": company_name,
            "industry": industry,
            "techstack": techstack
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==================== HEALTH & INFO ====================
@app.get("/api/info")
async def get_info():
    """Get API information"""
    return {
        "name": "Resume AI Builder API",
        "version": "1.0.0",
        "environment": settings.environment,
        "endpoints": {
            "analyze": "POST /api/analyze - Full resume analysis",
            "optimize": "POST /api/optimize - Get optimization suggestions",
            "parse": "POST /api/parse - Parse resume structure",
            "keywords": {
                "extract": "POST /api/keywords/extract - Extract keywords from job description",
                "match": "POST /api/keywords/match - Match keywords in resume"
            },
            "company": "POST /api/company/research - Research company tech stack"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=settings.port)
