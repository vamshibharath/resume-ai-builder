# Backend Setup Guide

## Installation

### 1. Python Environment Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# macOS/Linux:
source venv/bin/activate

# Windows:
venv\Scripts\activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt

# Download spaCy language model (for NLP)
python -m spacy download en_core_web_sm
```

### 3. Environment Configuration
```bash
# Copy example env file
cp .env.example .env

# Edit .env with your details
nano .env  # or use your editor
```

**Required environment variables:**
```
ANTHROPIC_API_KEY=sk-ant-...
ENVIRONMENT=development
PORT=8000
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

### 4. Run the Server
```bash
# Development (with auto-reload)
python -m uvicorn app.main:app --reload

# Or explicitly specify host and port
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Server will be available at: `http://localhost:8000`

## API Documentation

Once running, visit:
- **API Docs (Interactive)**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## Module Overview

### `resume_parser.py`
- `ResumeParser.parse_resume_text()` - Extract structured data from resume
- Extracts: sections, contact info, current role, experience years
- Supports text extraction from PDF and DOCX files

### `keyword_extractor.py`
- `KeywordExtractor.extract_keywords_from_job()` - Extract keywords from job description
- `KeywordExtractor.calculate_keyword_match_score()` - Calculate how many keywords match resume
- Categories: technical, soft skills, tools, frameworks, methodologies

### `ats_optimizer.py`
- `ATSOptimizer.analyze_ats_compatibility()` - Check ATS friendliness
- `ATSOptimizer.get_optimization_recommendations()` - Specific improvement suggestions
- `ATSOptimizer.generate_optimization_report()` - Full optimization report

### `claude_service.py`
- `ClaudeService.analyze_job_description()` - Use Claude to analyze job posting
- `ClaudeService.get_resume_improvement_suggestions()` - AI-powered suggestions
- `ClaudeService.research_company_tech_stack()` - Research company's likely tech

## Testing Endpoints

### Using cURL

**Health Check:**
```bash
curl http://localhost:8000/health
```

**Analyze Resume:**
```bash
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "resume_text": "Your resume text here...",
    "job_description": "Job description text here...",
    "company_name": "Company Name"
  }'
```

**Extract Keywords:**
```bash
curl -X POST http://localhost:8000/api/keywords/extract \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "job_description=Your job description here"
```

### Using Python

```python
import requests

response = requests.post('http://localhost:8000/api/analyze', json={
    'resume_text': 'Your resume...',
    'job_description': 'Job description...',
    'company_name': 'Company'
})

print(response.json())
```

## Troubleshooting

### ImportError for Claude
```
ModuleNotFoundError: No module named 'anthropic'
```
**Solution:** Ensure `anthropic` is installed:
```bash
pip install anthropic
```

### Port Already in Use
```
OSError: [Errno 48] Address already in use
```
**Solution:** Use a different port:
```bash
python -m uvicorn app.main:app --port 8001
```

### Claude API Key Invalid
```
APIError: Invalid API key
```
**Solution:** 
- Check your API key in `.env`
- Make sure it starts with `sk-ant-`
- Verify it's valid at [Anthropic Console](https://console.anthropic.com/)

### CORS Errors
If frontend can't reach backend:
1. Check `CORS_ORIGINS` in `.env` matches your frontend URL
2. Ensure backend is running on the correct port
3. Check browser console for specific CORS error

### Connection Timeout
If requests timeout:
- Claude API responses can take 5-15 seconds
- Check your internet connection
- Verify API key has sufficient quota
- Check Anthropic status page

## Performance Tips

### For Large Resumes
- Keep resume length reasonable (under 3000 characters per section)
- Use cleaner text without excessive formatting

### For Faster Analysis
- Provide company name for tech stack research (cached responses)
- Use specific job descriptions (more targeted analysis)

### Caching
Consider adding Redis for:
- Company tech stack research results
- Common job title analyses
- Keyword extraction results

## Production Deployment

### Using Gunicorn
```bash
pip install gunicorn

gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker
```

### Using Docker
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY app ./app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment for Production
```
ANTHROPIC_API_KEY=sk-ant-...
ENVIRONMENT=production
PORT=8000
CORS_ORIGINS=https://yourdomain.com
```

## Monitoring

### Log Analysis
The app logs to console/stdout. For production, integrate with:
- ELK Stack (Elasticsearch, Logstash, Kibana)
- CloudWatch (AWS)
- DataDog
- New Relic
- Sentry (for error tracking)

---

**Ready to optimize resumes! 🚀**
