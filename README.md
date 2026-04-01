# Resume AI Builder

An advanced, intelligent resume optimization platform powered by AI that helps you tailor your resume to pass ATS systems and match job descriptions perfectly.

## 🎯 Features

### Core Intelligence
- **AI-Powered Job Analysis**: Claude API analyzes job descriptions to extract:
  - Job title & role requirements
  - Key responsibilities & scenarios
  - Required/preferred skills
  - Tech stack & tools
  - Company industry & seniority level

- **100% Keyword Matching**: Extracts ALL keywords from job descriptions and matches them to your resume:
  - Identifies matched keywords (highlighted)
  - Detects missing keywords
  - Provides visual match percentage

- **Role Detection & Alignment**: 
  - Automatically detects your current role
  - Aligns your resume title to match the target position
  - Updates role references throughout the resume

- **Company Research**: 
  - Researches company tech stack
  - Suggests technologies to highlight
  - Provides context for experience reframing

- **Working Scenario Matching**:
  - Analyzes job description scenarios
  - Suggests resume bullet points that match job scenarios
  - Ensures your experiences align with what they're looking for

### ATS Optimization
- Formatting analysis and recommendations
- Structure validation for ATS compatibility
- Keyword placement optimization
- Real-time compatibility scoring

## 🏗️ Architecture

```
resume-ai-builder/
├── backend/
│   ├── app/
│   │   ├── modules/
│   │   │   ├── resume_parser.py      # Parse & extract from resumes
│   │   │   ├── keyword_extractor.py  # Extract & match keywords
│   │   │   ├── ats_optimizer.py      # ATS compatibility scoring
│   │   │   └── claude_service.py     # Claude API integration
│   │   ├── main.py                   # FastAPI server
│   │   ├── schemas.py                # Response models
│   │   └── config.py                 # Configuration
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FileUpload.tsx        # Resume & job upload
│   │   │   └── AnalysisResults.tsx   # Results display
│   │   ├── services/
│   │   │   └── api.ts                # API client
│   │   ├── styles/
│   │   └── App.tsx                   # Main app component
│   ├── package.json
│   ├── vite.config.ts
│   └── index.html
│
└── README.md
```

## 📋 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 16+
- Anthropic API Key (Claude)

### Backend Setup

1. **Navigate to backend**:
   ```bash
   cd backend
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env and add your Anthropic API key
   ```

5. **Run the server**:
   ```bash
   python -m uvicorn app.main:app --reload
   ```
   
   Server will run on `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```
   
   App will run on `http://localhost:5173`

## 🚀 Usage

1. **Open the app** at `http://localhost:5173`

2. **Upload or paste** your resume

3. **Upload or paste** the job description

4. **Optionally provide** company name for tech stack research

5. **Click "Analyze Resume"** and get:
   - Job requirements breakdown
   - Keyword match percentage (with matched/missing keywords)
   - ATS compatibility score
   - Specific improvement suggestions
   - Company tech stack insights

## 📊 API Endpoints

### Analysis
- `POST /api/analyze` - Full resume analysis against job description
- `POST /api/optimize` - Get optimization suggestions
- `POST /api/parse` - Parse resume structure

### Keywords
- `POST /api/keywords/extract` - Extract keywords from job description
- `POST /api/keywords/match` - Match keywords in resume

### Company Research  
- `POST /api/company/research` - Research company tech stack

### Health
- `GET /health` - Health check
- `GET /api/info` - API information

## 🤖 How the AI Works

### Resume Parsing
1. Extracts contact information (email, phone, LinkedIn, GitHub)
2. Identifies resume sections (summary, experience, education, skills)
3. Calculates years of experience
4. Detects current job title

### Job Analysis (Claude)
Using Claude API to understand:
- Job title and role requirements
- Key responsibilities
- Technical and soft skills needed
- Years of experience required
- Working scenarios and projects
- Company industry/sector

### Keyword Extraction
1. Scans job description for tech keywords (500+ known)
2. Extracts soft skills and methodologies
3. Identifies tools and frameworks
4. Organizes by category

### Matching Algorithm
- Compares keywords against resume text
- Calculates coverage percentage per category
- Identifies critical missing keywords
- Suggests optimal placement

### AI Suggestions
Claude provides specific, actionable suggestions:
- How to reframe experiences to match job scenarios
- Best places to insert missing keywords
- Experience descriptions that match job working styles
- ATS-friendly formatting recommendations

## 🎨 Frontend Features

### Split View
- Resume editor on the left
- Job description on the right
- Real-time sync

### Analysis Dashboard
- **Overview Tab**: Job requirements summary
- **Keywords Tab**: Visual keyword match with matched/missing breakdown
- **Suggestions Tab**: Prioritized improvement recommendations
- **Company Info Tab**: Company tech stack and culture

### Real-time Scoring
- ATS compatibility score (0-100)
- Keyword match percentage
- Coverage per skill category

## 🔐 Security

- API keys stored in `.env` (never committed)
- No resume data stored permanently
- All processing is stateless
- CORS configured for localhost development

## 📦 Deployment

### Docker (Coming Soon)
```bash
docker-compose up
```

### Production Checklist
- [ ] Set proper CORS origins
- [ ] Use production ASGI server (Gunicorn + Uvicorn)
- [ ] Enable HTTPS
- [ ] Set up proper logging
- [ ] Configure rate limiting
- [ ] Add authentication if exposing publicly

## 🛠️ Troubleshooting

### Backend not connecting
- Check backend is running on `http://localhost:8000`
- Verify CORS origins in `.env`
- Check browser console for errors

### API key errors
- Ensure `ANTHROPIC_API_KEY` is set in `.env`
- Test API key with simple request

### Analysis timing out
- Claude API processing can take 5-10 seconds
- Check backend logs for errors
- Verify API key has sufficient quota

## 📈 Future Enhancements

- [ ] Resume template generator
- [ ] Batch processing multiple jobs
- [ ] Historical analysis tracking
- [ ] Resume version management
- [ ] LinkedIn profile integration
- [ ] Job description scraping (Indeed, LinkedIn, etc.)
- [ ] Industry-specific optimizations
- [ ] Mock ATS scoring from multiple vendors
- [ ] Resume builder UI within app
- [ ] Export optimized resume (PDF/DOCX)

## 🤝 Contributing

Feel free to enhance this tool! Areas for contribution:
- Add more keyword databases
- Improve ATS scoring algorithms
- Add support for more file formats
- Create industry-specific analyzers
- Add more company research sources

## 📄 License

MIT License - feel free to use this for your job search!

## 🙏 Acknowledgments

- Built with [Claude API](https://www.anthropic.com/)
- Frontend with [React](https://react.dev/) & [Vite](https://vitejs.dev/)
- Backend with [FastAPI](https://fastapi.tiangolo.com/)
- NLP with [spaCy](https://spacy.io/)

---

**Good luck with your job search! 🚀**
