# Resume AI Builder - Architecture & Advanced Guide

## 🏗️ System Architecture

### Data Flow

```
┌──────────────────────────────────────────────────────────┐
│                  Frontend (React)                         │
│  - File Upload UI                                         │
│  - Text Input Areas                                       │
│  - Result Visualization                                   │
└──────────┬──────────────────────────────────────────────┘
           │
           │ HTTP POST
           │ {resume_text, job_description, company_name}
           ↓
┌──────────────────────────────────────────────────────────┐
│              Backend API (FastAPI)                        │
│                                                           │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Route: POST /api/analyze                           │  │
│  └────────────────────────────────────────────────────┘  │
│           │                                               │
│           ├─→ ResumeParser.parse_resume_text()           │
│           │   ├─ Extract sections                         │
│           │   ├─ Get contact info                         │
│           │   ├─ Detect role title                        │
│           │   └─ Calculate experience                     │
│           │                                               │
│           ├─→ ClaudeService.analyze_job_description()    │
│           │   ├─ Parse job title                          │
│           │   ├─ Extract responsibilities                 │
│           │   ├─ Identify required skills                 │
│           │   ├─ Detect tech stack                        │
│           │   ├─ Determine seniority level                │
│           │   └─ Understand working scenarios             │
│           │                                               │
│           ├─→ KeywordExtractor.extract_keywords_from_job()
│           │   ├─ Technical keywords                       │
│           │   ├─ Soft skills                              │
│           │   ├─ Tools & frameworks                       │
│           │   └─ Methodologies                            │
│           │                                               │
│           ├─→ KeywordExtractor.calculate_keyword_match()  │
│           │   ├─ Match percentage                         │
│           │   ├─ Matched keywords                         │
│           │   ├─ Missing keywords                         │
│           │   └─ Coverage by category                     │
│           │                                               │
│           ├─→ ATSOptimizer.analyze_ats_compatibility()    │
│           │   ├─ Check formatting issues                  │
│           │   ├─ Find keyword gaps                        │
│           │   └─ Calculate score (0-100)                  │
│           │                                               │
│           ├─→ ClaudeService.get_resume_improvement_suggestions()
│           │   ├─ Role title recommendations               │
│           │   ├─ Section-by-section improvements          │
│           │   ├─ Reason for each change                   │
│           │   ├─ Missing keywords suggestions             │
│           │   └─ Scenario-based additions                 │
│           │                                               │
│           └─→ ClaudeService.research_company_tech_stack() │
│               ├─ Likely programming languages             │
│               ├─ Frontend technologies                     │
│               ├─ Backend frameworks                        │
│               ├─ Cloud platforms                           │
│               └─ Development practices                     │
│                                                           │
└──────────┬──────────────────────────────────────────────┘
           │
           │ HTTP Response (JSON)
           │ {
           │   job_analysis: {...},
           │   resume_data: {...},
           │   keyword_match: {...},
           │   ats_compatibility: {...},
           │   improvements: {...},
           │   company_techstack: {...}
           │ }
           ↓
┌──────────────────────────────────────────────────────────┐
│                  Frontend (React)                         │
│  - Parse Response                                         │
│  - Format for Display                                     │
│  - Show Overview/Keywords/Suggestions/Company Tabs        │
└──────────────────────────────────────────────────────────┘
```

## 🔍 Detailed Module Analysis

### 1. Resume Parser Module

**Purpose:** Extract structured data from resumes

**Key Functions:**
```python
def parse_resume_text(text: str) → Dict
  ├─ _extract_sections()      # Find sections
  ├─ _extract_contact_info()  # Email, phone, LinkedIn, GitHub
  ├─ _extract_current_role()  # Current job title
  └─ _calculate_experience()  # Years of experience
```

**Example Output:**
```json
{
  "sections": {
    "experience": "...",
    "skills": "...",
    "education": "..."
  },
  "contact_info": {
    "email": "user@example.com",
    "phone": "(123) 456-7890",
    "linkedin": "linkedin.com/in/user"
  },
  "current_role": "Senior Software Engineer",
  "years_of_experience": 5
}
```

### 2. Keyword Extractor Module

**Purpose:** Extract and match keywords between job description and resume

**Algorithm:**
1. **Extraction Phase:**
   - Tokenize job description
   - Match against 500+ tech keywords database
   - Extract soft skills patterns
   - Identify methodologies

2. **Matching Phase:**
   - Compare extracted keywords to resume text
   - Calculate coverage percentage
   - Group by category
   - Identify critical gaps

**Keyword Categories:**
- Technical: Python, JavaScript, Java, Go, Rust, etc.
- Frontend: React, Vue, Angular, Svelte, etc.
- Backend: FastAPI, Django, Flask, Spring, Express, etc.
- Databases: PostgreSQL, MySQL, MongoDB, Redis, etc.
- DevOps: Docker, Kubernetes, CI/CD, AWS, GCP, Azure
- Libraries: TensorFlow, PyTorch, scikit-learn, pandas

**Example Output:**
```json
{
  "matched_keywords": ["react", "javascript", "rest api"],
  "missing_keywords": ["docker", "aws", "typescript"],
  "match_percentage": 75.0,
  "coverage_by_category": {
    "technical": {"matched": 2, "total": 5, "percentage": 40.0},
    "frontend": {"matched": 1, "total": 3, "percentage": 33.3}
  }
}
```

### 3. ATS Optimizer Module

**Purpose:** Measure and improve ATS compatibility

**Scoring Algorithm:**
```
final_score = (keyword_score + formatting_score) / 2

Where:
  - keyword_score = (matched_keywords / total_keywords) * 100
  - formatting_score = 100 - (issues_count * 10)
  - max_score = 100
```

**ATS Issues Detected:**
- HTML/XML tags in resume
- Special symbols (©, ®, ™)
- Complex formatting
- Keyword density too low

**Best Practices Checked:**
1. **Formatting:**
   - Standard fonts (Arial, Calibri, Courier)
   - Basic formatting without graphics
   - Proper margins and spacing
   - Single/1.15 line spacing
   - Bullet points for readability

2. **Structure:**
   - Logical section order
   - Clear headings
   - No headers/footers
   - No text boxes or columns

3. **Keywords:**
   - Mirror job terminology
   - Include full tech names
   - Add context to keywords
   - Avoid abbreviations alone

### 4. Claude Service Module

**Purpose:** AI-powered analysis using Anthropic's Claude API

**Key Methods:**

#### analyze_job_description()
**Input:** Job description text
**Output:** Structured job requirements
```json
{
  "job_title": "Senior React Developer",
  "key_responsibilities": ["Build UI components", "Lead code reviews"],
  "required_skills": ["React", "JavaScript", "REST APIs"],
  "preferred_skills": ["TypeScript", "Docker", "AWS"],
  "years_of_experience": 5,
  "company_industry": "FinTech",
  "tech_stack": ["React", "Node.js", "PostgreSQL", "AWS"],
  "seniority_level": "Senior",
  "working_scenario": "You'll work in agile teams building scalable React applications..."
}
```

#### get_resume_improvement_suggestions()
**Input:** Resume, job description, job analysis
**Output:** Specific recommendations
```json
{
  "role_title_update": "Senior React Developer",
  "key_improvements": [
    {
      "section": "Experience",
      "original": "Developed web application",
      "suggested": "Built scalable React application with REST APIs on AWS",
      "reason": "Includes job-specific keywords and technologies",
      "priority": "high"
    }
  ],
  "missing_keywords": ["Docker", "TypeScript"],
  "scenario_additions": [
    {
      "bullet_point": "Led code reviews and mentored junior developers",
      "section": "Experience"
    }
  ]
}
```

#### research_company_tech_stack()
**Input:** Company name, industry
**Output:** Likely tech environment
```json
{
  "likely_tech_stack": ["React", "Node.js", "AWS"],
  "cloud_platforms": ["AWS", "CloudFront"],
  "frontend_tech": ["React", "TypeScript", "Webpack"],
  "backend_tech": ["Node.js", "Express", "PostgreSQL"],
  "databases": ["PostgreSQL", "Redis"],
  "development_practices": ["Agile", "CI/CD", "GitOps"]
}
```

## 🧠 AI Intelligence Features

### 1. Role Detection & Alignment

**Problem:** Job title in your resume doesn't match target role

**Solution:**
- Claude analyzes job description for exact title
- Suggests title update to match (80%+ similarity)
- Ensures consistency throughout resume

**Example:**
- Job: "Senior React Engineer"
- Your resume: "Web Developer (3 years)"
- Claude suggests: "Senior Web Developer" or "Senior React Engineer"

### 2. Working Scenario Matching

**Problem:** Resume doesn't show you've done similar work

**Solution:**
- Claude extracts working scenarios from job description
- Highlights your relevant experiences
- Suggests how to reframe your bullet points

**Example:**
- Job scenario: "Lead technical decisions in agile teams"
- Your experience: "Worked on development team"
- Reframe to: "Led technical architecture decisions in cross-functional agile team"

### 3. Tech Stack Intelligence

**Problem:** Resume missing tech stack required by job

**Solution:**
- Claude research company's likely tech stack
- Identifies gaps in your skills presentation
- Suggests strategic additions

**Example:**
- Company: Tech startup using microservices
- Missing: Docker, Kubernetes, CI/CD
- Suggestion: Add DevOps skills if you have them, or highlight relevant container experience

### 4. Keyword Density Optimization

**Problem:** Keywords scattered or missing

**Solution:**
- Extracts 100+ keywords from job description
- Calculates coverage percentage
- Highlights critical missing keywords
- Suggests natural placement strategies

**Example:**
- Job requires: Python, Django, PostgreSQL, REST API, Docker, AWS
- Your resume mentions: Python, Django only (33% coverage)
- Missing: PostgreSQL, REST API, Docker, AWS
- Suggestion: Add these to projects or skills section

## 🔄 Workflow Optimization

### Standard Usage Flow

```
1. User Input
   └─ Resume text + Job description

2. Parsing
   ├─ Extract resume sections
   └─ Parse contact information

3. Analysis
   ├─ Analyze job requirements
   ├─ Extract keywords
   ├─ Calculate keyword match
   └─ Check ATS compatibility

4. AI Enhancement
   ├─ Get improvement suggestions
   ├─ Research company tech
   └─ Generate recommendations

5. Presentation
   ├─ Format results
   ├─ Calculate scores
   └─ Display in UI tabs

6. User Action
   └─ Review suggestions & update resume
```

### Iterative Improvement Loop

```
Resume v1
   ↓ (Analyze)
Results: 65% match
   ↓ (User updates resume based on suggestions)
Resume v2
   ↓ (Analyze again)
Results: 82% match
   ↓ (User adds remaining keywords)
Resume v3
   ↓ (Final analysis)
Results: 95% match ✅ Ready to submit!
```

## 🚀 Performance Optimization

### Caching Strategies (Future)

```python
# Cache company research
@cache(ttl=3600)
def research_company(company_name, industry):
    # Results cached for 1 hour

# Cache keyword extraction
@cache(ttl=1800)
def extract_keywords(job_description_hash):
    # Same job description = cached results

# Cache common job titles
@cache(ttl=86400)
def analyze_common_jobs():
    # Popular job titles analyzed nightly
```

### Batch Processing (Future)

```python
# Analyze multiple jobs at once
async def batch_analyze(resumes, job_descriptions):
    # Parallel processing
    # Results aggregation
    # Best match ranking
```

## 🔒 Security Considerations

### Current Security
- ✅ API key stored in `.env` (never committed)
- ✅ No resume data persistence
- ✅ CORS configured for localhost only
- ✅ No authentication required (for development)

### Production Security Recommendations
- 🔐 Add API authentication (OAuth, JWT)
- 🔐 Encrypt stored resume data
- 🔐 Rate limiting per IP/user
- 🔐 Use HTTPS only
- 🔐 Add request signing
- 🔐 Implement logging/auditing
- 🔐 Regular security audits

## 📊 Metrics & Monitoring

### Key Metrics to Track
- Average analysis time
- API error rates
- Keyword match distribution
- ATS score distribution
- User engagement

### Example Monitoring Query
```sql
SELECT 
  COUNT(*) as total_analyses,
  AVG(analysis_time_ms) as avg_time,
  AVG(ats_score) as avg_ats_score,
  AVG(keyword_match_pct) as avg_keyword_match
FROM analyses
WHERE created_at > NOW() - INTERVAL 24 HOUR;
```

---

**Advanced architecture guide complete! 🏛️**
