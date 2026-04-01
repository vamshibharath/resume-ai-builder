# Resume AI Builder - Visual Project Map

## 🗺️ Complete Project Structure

```
resume-ai-builder/
│
├─ 📄 IMPLEMENTATION_SUMMARY.md ← ⭐ START HERE!
├─ 📄 README.md ────────────────→ Project overview & features
├─ 📄 QUICK_START.md ───────────→ Setup in 5 minutes
├─ 📄 FEATURES.md ──────────────→ All 7 core features explained
├─ 📄 ARCHITECTURE.md ──────────→ Technical deep dive
├─ 📄 PROJECT_STRUCTURE.md ─────→ Directory layout
│
├─ 📄 docker-compose.yml ───────→ One-command startup
├─ 📄 .gitignore ────────────────→ Git configuration
│
│
├─ 📂 BACKEND/ │████████████ Production FastAPI Server │
│  │
│  ├─ 📄 requirements.txt ───────→ All Python packages
│  ├─ 📄 .env.example ───────────→ Environment template
│  ├─ 📄 Dockerfile ─────────────→ Container image
│  ├─ 📄 .gitignore ─────────────→ Backend git ignore
│  ├─ 📄 BACKEND_SETUP.md ───────→ Setup guide
│  │
│  └─ 📂 app/ │ Main Application Package │
│     │
│     ├─ 📄 main.py ─────→ 🌐 FastAPI Server & 9 API Routes
│     │   ├─ POST /api/analyze
│     │   ├─ POST /api/optimize
│     │   ├─ POST /api/parse
│     │   ├─ POST /api/keywords/extract
│     │   ├─ POST /api/keywords/match
│     │   ├─ POST /api/company/research
│     │   ├─ POST /api/upload/resume
│     │   ├─ GET /health
│     │   └─ GET /api/info
│     │
│     ├─ 📄 schemas.py ──→ Pydantic request/response models
│     ├─ 📄 config.py ───→ Settings & environment config
│     │
│     ├─ 📂 modules/ │ Intelligence Layers │
│     │  │
│     │  ├─ 📄 resume_parser.py
│     │  │   └─ Parse resumes, extract sections, detect role
│     │  │
│     │  ├─ 📄 keyword_extractor.py
│     │  │   └─ Extract keywords, match against 500+ database
│     │  │
│     │  ├─ 📄 ats_optimizer.py
│     │  │   └─ Score compatibility, find issues, recommend fixes
│     │  │
│     │  └─ 📄 claude_service.py
│     │      └─ AI analysis, suggestions, company research
│     │
│     └─ 📂 utils/
│         └─ 📄 __init__.py
│
│
├─ 📂 FRONTEND/ │████████████ React TypeScript UI │
│  │
│  ├─ 📄 package.json ───────────→ All npm packages
│  ├─ 📄 vite.config.ts ─────────→ Build configuration
│  ├─ 📄 tsconfig.json ──────────→ TypeScript settings
│  ├─ 📄 tsconfig.node.json ─────→ Node TypeScript config
│  ├─ 📄 index.html ─────────────→ HTML template
│  ├─ 📄 vite-env.d.ts ──────────→ Vite types
│  ├─ 📄 Dockerfile ─────────────→ Container image
│  ├─ 📄 .eslintrc.json ─────────→ Code linting
│  ├─ 📄 .gitignore ─────────────→ Frontend git ignore
│  ├─ 📄 FRONTEND_SETUP.md ──────→ Setup guide
│  │
│  └─ 📂 src/ │ React Application │
│     │
│     ├─ 📄 main.tsx ────────────→ Entry point
│     ├─ 📄 App.tsx ────────────→ 🎨 Main App Component
│     │   └─ Renders FileUpload + AnalysisResults + Company Input
│     │
│     ├─ 📂 components/ │ React Components │
│     │  │
│     │  ├─ 📄 FileUpload.tsx
│     │  │   └─ Dual text areas, file upload, character count
│     │  │
│     │  └─ 📄 AnalysisResults.tsx
│     │      └─ 4 tabbed views: Overview, Keywords, Suggestions, Company
│     │
│     ├─ 📂 services/ │ API Client │
│     │  └─ 📄 api.ts ────────────→ Axios HTTP client
│     │     ├─ analyzeResume()
│     │     ├─ optimizeResume()
│     │     ├─ extractKeywords()
│     │     ├─ parseResume()
│     │     └─ researchCompany()
│     │
│     └─ 📂 styles/ │ CSS Stylesheets │
│        ├─ 📄 index.css
│        ├─ 📄 App.css
│        ├─ 📄 FileUpload.css (fixed layout)
│        └─ 📄 AnalysisResults.css (tabbed interface)
│
└─ END OF PROJECT
```

---

## 🔄 Data Flow Visualization

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERACTION                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Upload Resume                2. Upload Job Description  │
│  ┌──────────────────────┐        ┌──────────────────────┐   │
│  │ Text Area / File ───→│ Parse  │ Text Area / File ──→│    │
│  └──────────────────────┘        └──────────────────────┘   │
│           │                                  │               │
│           └──────────────▬──────────────────┘               │
│                          │                                   │
│  3. (Optional) Company    │                                  │
│  └──────────────────────→┤                                  │
│                          │                                  │
│     [Analyze Resume]      │                                  │
│            ↓              │                                  │
│     Click Button ────────→┤                                  │
│                          ↓                                  │
└─────────────────────────────────────────────────────────────┘
                           │
                 HTTP POST Request
                           ├─── Headers: Content-Type: application/json
                           ├─── Body: {resume_text, job_description, company_name}
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND PROCESSING                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Route: POST /api/analyze                                   │
│       ↓                                                     │
│  ┌────────────────────────────────────────────┐             │
│  │ 1. RESUME PARSING                         │             │
│  │    resume_parser.parse_resume_text()      │             │
│  │    ├─ Extract sections                    │             │
│  │    ├─ Get contact info                    │             │
│  │    ├─ Detect role                         │             │
│  │    └─ Calculate experience                │             │
│  └────────────────────────────────────────────┘             │
│           ↓                                                 │
│  ┌────────────────────────────────────────────┐             │
│  │ 2. JOB ANALYSIS (Claude AI)               │             │
│  │    claude_service.analyze_job_description()│             │
│  │    ├─ Parse title                         │             │
│  │    ├─ Extract responsibilities            │             │
│  │    ├─ Identify skills                     │             │
│  │    ├─ Detect tech stack                   │             │
│  │    └─ Understand scenarios                │             │
│  └────────────────────────────────────────────┘             │
│           ↓                                                 │
│  ┌────────────────────────────────────────────┐             │
│  │ 3. KEYWORD EXTRACTION & MATCHING          │             │
│  │    keyword_extractor.extract_keywords()   │             │
│  │    ├─ Extract 100+ keywords               │             │
│  │    ├─ Match to resume                     │             │
│  │    ├─ Calculate coverage %                │             │
│  │    └─ Organize by category                │             │
│  └────────────────────────────────────────────┘             │
│           ↓                                                 │
│  ┌────────────────────────────────────────────┐             │
│  │ 4. ATS COMPATIBILITY ANALYSIS             │             │
│  │    ats_optimizer.analyze_ats_compatibility│             │
│  │    ├─ Check formatting                    │             │
│  │    ├─ Find issues                         │             │
│  │    ├─ Score 0-100                         │             │
│  │    └─ Identify problems                   │             │
│  └────────────────────────────────────────────┘             │
│           ↓                                                 │
│  ┌────────────────────────────────────────────┐             │
│  │ 5. AI SUGGESTIONS (Claude)                │             │
│  │    claude_service.get_improvements()      │             │
│  │    ├─ Title recommendations               │             │
│  │    ├─ Section improvements                │             │
│  │    ├─ Missing keywords                    │             │
│  │    └─ Scenario additions                  │             │
│  └────────────────────────────────────────────┘             │
│           ↓                                                 │
│  ┌────────────────────────────────────────────┐             │
│  │ 6. COMPANY RESEARCH (Optional)            │             │
│  │    claude_service.research_company_tech()│             │
│  │    ├─ Likely tech stack                   │             │
│  │    ├─ Frontend tech                       │             │
│  │    ├─ Backend tech                        │             │
│  │    └─ DevOps tools                        │             │
│  └────────────────────────────────────────────┘             │
│           ↓                                                 │
│  All results compiled into JSON response                    │
│           ↓                                                 │
└─────────────────────────────────────────────────────────────┘
                           │
                 HTTP Response (JSON)
                           ├─── job_analysis
                           ├─── resume_data
                           ├─── keyword_match
                           ├─── ats_compatibility
                           ├─── improvements
                           └─── company_techstack
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                   FRONTEND RENDERING                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  AnalysisResults Component loads with 4 tabs:              │
│  ┌────────────────────────────────────────────┐             │
│  │ [Overview] [Keywords] [Suggestions] [Company]│            │
│  ├────────────────────────────────────────────┤             │
│  │                                            │             │
│  │ Tab 1: Overview                            │             │
│  │ ├─ Job requirements                        │             │
│  │ ├─ Key responsibilities                    │             │
│  │ └─ Required skills                         │             │
│  │                                            │             │
│  │ Tab 2: Keywords                            │             │
│  │ ├─ Matched keywords (✅)                    │             │
│  │ ├─ Missing keywords (❌)                    │             │
│  │ └─ Match % score                           │             │
│  │                                            │             │
│  │ Tab 3: Suggestions                         │             │
│  │ ├─ High priority items                     │             │
│  │ ├─ Medium priority items                   │             │
│  │ └─ Low priority items                      │             │
│  │                                            │             │
│  │ Tab 4: Company Info                        │             │
│  │ ├─ Tech stack                              │             │
│  │ ├─ Platforms                               │             │
│  │ └─ Dev practices                           │             │
│  │                                            │             │
│  └────────────────────────────────────────────┘             │
│                                                             │
│  Score Badges Display:                                      │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │ ATS Score 85%│  │ Keyword 78%  │                        │
│  └──────────────┘  └──────────────┘                        │
│                                                             │
│  User Reviews Results & Updates Resume Accordingly          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📑 Module Interaction Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     API REQUEST                             │
│                   /api/analyze                              │
└──────────────────────────┬──────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ↓                  ↓                  ↓
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Resume Text  │  │ Job Desc     │  │ Company Name │
└──────────────┘  └──────────────┘  └──────────────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ↓                  ↓                  ↓
    ┌─────────────┐   ┌──────────────┐  ┌──────────────┐
    │   PARSER    │   │   ANALYZER   │  │   RESEARCHER │
    │  Module 1   │   │   Module 2   │  │   Module 4   │
    │             │   │              │  │              │
    │ Extract:    │   │ Analyze:     │  │ Research:    │
    │ • Sections  │   │ • Title      │  │ • Tech Stack │
    │ • Contact   │   │ • Skills     │  │ • Platforms  │
    │ • Role      │   │ • Tech Stack │  │ • Practices  │
    │ • Exp Yrs   │   │ • Scenarios  │  │              │
    └──────┬──────┘   └───────┬──────┘  └────────┬─────┘
           │                  │                  │
           │  ┌────────────────┼─────────────────┘
           │  │                │
           │  ↓                ↓
           │  ┌───────────────────────────┐
           └─→│   KEYWORD EXTRACTOR      │
              │   Module 3               │
              │                          │
              │ • Extract 100+ keywords  │
              │ • Match to resume        │
              │ • Calculate coverage %   │
              │ • Find missing keywords  │
              └──────────┬───────────────┘
                         │
              ┌──────────┴──────────┐
              │                     │
              ↓                     ↓
        ┌──────────────┐    ┌──────────────┐
        │ ATS OPTIMIZER│    │     CLAUDE   │
        │  Module 5    │    │     MODULE   │
        │              │    │              │
        │ • Score 0-100    │ • Get Sugg.  │
        │ • Find Issues    │ • Get Advice │
        │ • Best Practice  │ • Context    │
        └────────┬─────┘    └──────┬───────┘
                 │                 │
                 └────────┬─────────┘
                          │
        ┌─────────────────┴─────────────────┐
        │                                   │
        ↓                                   ↓
    ┌────────────────┐          ┌────────────────┐
    │ Compiled JSON  │          │ Final Response │
    │ Response:      │   ────→   │ Returned to    │
    │                │          │ Frontend       │
    │ • job_analysis │          │                │
    │ • keyword_match│          └────────────────┘
    │ • ats_score    │
    │ • suggestions  │
    │ • company_info │
    └────────────────┘
```

---

## 🎯 Component Hierarchy

```
App (React)
│
├─ FileUpload
│  ├─ Text Area (Resume)
│  ├─ File Input (Resume)
│  ├─ Text Area (Job)
│  └─ File Input (Job)
│
├─ Company Input
│  └─ Text Input (Company Name)
│
├─ Analyze Button
│  └─ onClick Handler → API Call
│
└─ AnalysisResults
   ├─ Results Header
   │  ├─ ATS Score Badge
   │  └─ Keyword Match Badge
   │
   ├─ Tab Navigation
   │  ├─ Overview Tab
   │  ├─ Keywords Tab
   │  ├─ Suggestions Tab
   │  └─ Company Tab
   │
   └─ Tab Content
      ├─ Overview Content
      │  ├─ Job Info Grid
      │  ├─ Responsibilities List
      │  └─ Skills Tags
      │
      ├─ Keywords Content
      │  ├─ Match Stats
      │  ├─ Matched Keywords
      │  └─ Missing Keywords
      │
      ├─ Suggestions Content
      │  └─ Suggestion Cards (Priority-based)
      │
      └─ Company Content
         └─ Tech Items by Category
```

---

## 🚀 Quick Navigation

| Want to... | Go to... |
|-----------|----------|
| Understand features | FEATURES.md |
| Get started quickly | QUICK_START.md |
| Set up backend | BACKEND_SETUP.md |
| Set up frontend | FRONTEND_SETUP.md |
| Learn architecture | ARCHITECTURE.md |
| See project layout | PROJECT_STRUCTURE.md |
| Read summary | IMPLEMENTATION_SUMMARY.md |

---

**Everything is organized, documented, and ready to use! 🎉**
