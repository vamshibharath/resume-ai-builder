# Quick Start Guide

## 🚀 5-Minute Setup

### Option 1: Using Docker (Easiest)

**Prerequisites:**
- Docker installed
- Anthropic API key

**Setup:**
```bash
# 1. Clone or navigate to the project
cd resume-ai-builder

# 2. Create .env file
echo "ANTHROPIC_API_KEY=your_key_here" > .env

# 3. Start everything
docker-compose up

# 4. Open browser
# Frontend: http://localhost:5173
# Backend docs: http://localhost:8000/docs
```

That's it! ✨

### Option 2: Manual Setup (More Control)

#### Terminal 1 - Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Copy .env.example to .env and add your API key
cp .env.example .env
nano .env  # Add ANTHROPIC_API_KEY

# Run
python -m uvicorn app.main:app --reload
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm install
npm run dev
```

#### Open in Browser
```
http://localhost:5173
```

## 📝 First Use

### Step 1: Prepare Your Resume
- Copy your full resume text, OR
- Upload a resume file (.txt, .pdf)

### Step 2: Find a Job Description
- Copy the full job description, OR
- Upload a job description file (.txt, .pdf)

### Step 3: (Optional) Add Company Name
- If you know the company, add it for tech stack research
- Example: "Google", "Microsoft", "Startup Inc"

### Step 4: Click Analyze
- Click "Analyze Resume"
- Wait for results (usually 5-15 seconds)

### Step 5: Review Results

#### 📊 Overview Tab
- See complete job requirements
- Understand responsibilities
- Find required skills

#### 🔑 Keywords Tab
- ✅ Keywords you already have
- ❌ Keywords you're missing
- Match percentage score

#### 💡 Suggestions Tab
- Prioritized improvements (High/Medium/Low)
- Specific text recommendations
- Where to make changes

#### 🏢 Company Tab
- Likely tech stack
- Development tools
- Platforms they use

## 🎯 How to Use Results

### Example Workflow

**Job Description:** "Senior React Engineer at TechCorp"

**Analysis Results Show:**
- ✅ Matched: React, JavaScript, REST APIs (80% match)
- ❌ Missing: Docker, AWS, CI/CD, TypeScript

**You Should:**

1. **Add Missing Skills:**
   - Update skills section to include Docker, AWS, CI/CD
   - Highlight TypeScript experience if you have it

2. **Reframe Experiences:**
   - Instead of: "Built web applications"
   - Change to: "Built scalable React applications with REST APIs, deployed on AWS using Docker containers"

3. **Add Scenarios:**
   - If job description mentions "leading teams"
   - Find experience about mentoring and add it

4. **Check ATS Score:**
   - Aim for 80%+ compatibility
   - Update your resume
   - Re-run analysis to verify improvements

### Success Criteria

✅ **Good Resume for This Job:**
- Keyword match: 80%+
- ATS compatibility: 75%+
- Has targeted experiences matching job scenarios
- Includes all required tech stack items

## 🔧 Troubleshooting

### "Cannot reach backend"
```bash
# Check backend is running
curl http://localhost:8000/health
# Should return: {"status":"healthy"}
```

### "API Key Invalid"
```bash
# Check your API key
# Visit: https://console.anthropic.com/
# Copy the correct key
# Update in .env or docker-compose environment
```

### "Analysis taking too long"
- Normal: 5-15 seconds
- Check internet connection
- Verify API key has quota

### "Analysis failed"
- Check backend logs for errors
- Ensure resume and job description are not empty
- Try shorter sections if resume is very long

## 💡 Pro Tips

### Tip 1: Analyze Multiple Times
Run analysis multiple times after each edit to see improvement

### Tip 2: Copy Exact Keywords
If a keyword is marked as missing, copy-paste it from the job description into your resume

### Tip 3: Test with Similar Jobs
Test your resume against multiple job descriptions to build a comprehensive version

### Tip 4: Focus on Scenarios
Research what the company actually does, then highlight similar work you've done

### Tip 5: Keep History
Save a copy of your original resume before making changes

## 🚀 Next Steps

1. **Review the Results** - Understand what each section means
2. **Make Changes** - Update your resume based on suggestions
3. **Re-Analyze** - Run the analysis again to verify improvements
4. **Export** - Save your optimized resume
5. **Apply** - Submit to the job with confidence!

## 📚 Full Documentation

For detailed information, see:
- [README.md](./README.md) - Project overview
- [BACKEND_SETUP.md](./BACKEND_SETUP.md) - Backend details
- [FRONTEND_SETUP.md](./FRONTEND_SETUP.md) - Frontend details

## ❓ FAQ

**Q: Is my resume data saved?**
A: No! All processing is done immediately and data is not stored.

**Q: Can I use the same analysis for multiple jobs?**
A: Yes, but each job will have different requirements.

**Q: How accurate are the suggestions?**
A: Suggestions are AI-powered but not perfect. Use them as guidance, not rules.

**Q: Can I export my optimized resume?**
A: Currently copy-paste from the analysis. Export feature coming soon!

**Q: Does it guarantee I'll pass ATS?**
A: It optimizes for common ATS patterns but doesn't guarantee acceptance.

---

Ready to get started? Run the setup commands above! 🎉
