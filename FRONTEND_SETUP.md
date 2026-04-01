# Frontend Setup Guide

## Installation

### 1. Node.js Environment Setup
```bash
# Navigate to frontend directory
cd frontend

# Verify Node.js version (v16+ recommended)
node --version
npm --version
```

### 2. Install Dependencies
```bash
npm install
```

This will install:
- React 18.2
- Vite (fast build tool)
- TypeScript
- Axios (HTTP client)
- Lucide React (icons)

### 3. Development Server
```bash
npm run dev
```

The app will be available at: `http://localhost:5173`

### 4. Build for Production
```bash
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── FileUpload.tsx       # Resume & job upload form
│   │   └── AnalysisResults.tsx  # Results display with tabs
│   ├── services/
│   │   └── api.ts               # API client with axios
│   ├── styles/
│   │   ├── FileUpload.css
│   │   ├── AnalysisResults.css
│   │   ├── App.css
│   │   └── index.css
│   ├── App.tsx                  # Main app component
│   └── main.tsx                 # Entry point
├── index.html                   # HTML template
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies
```

## Component Overview

### FileUpload Component
- Dual text areas for resume and job description
- File upload support (TXT, PDF)
- Real-time character count
- Clean, intuitive UI

### AnalysisResults Component
- Tabbed interface with 4 views:
  - **Overview**: Job requirements, responsibilities, skills
  - **Keywords**: Matched vs. missing keywords visualization
  - **Suggestions**: Prioritized improvement recommendations
  - **Company Info**: Tech stack research results
- Real-time loading state
- Responsive score badges

### API Service
- `analyzeResume()` - Main analysis endpoint
- `optimizeResume()` - Get optimization suggestions
- `extractKeywords()` - Extract keywords from job
- `parseResume()` - Parse resume structure
- `researchCompany()` - Get company tech stack

## Styling System

### CSS Variables
The app uses CSS custom properties for theming:

```css
:root {
  --primary: #3b82f6;          /* Blue */
  --primary-dark: #1e40af;     /* Darker blue */
  --success: #10b981;          /* Green */
  --warning: #f59e0b;          /* Amber */
  --error: #ef4444;            /* Red */
  --text: #1f2937;             /* Dark gray */
  --text-light: #6b7280;       /* Light gray */
  --bg: #f9fafb;               /* Light background */
  --bg-light: #ffffff;         /* White */
  --border: #e5e7eb;           /* Border gray */
}
```

To customize colors, edit `FileUpload.css` `:root` section.

## Troubleshooting

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5173
```

**Solution:**
```bash
# Use different port
npm run dev -- --port 5174
```

### Module Not Found Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Clear npm cache
npm cache clean --force
npm install
```

### API Connection Issues

**Frontend can't reach backend?**

1. **Check backend is running:**
   ```bash
   # In another terminal
   cd backend
   python -m uvicorn app.main:app --reload
   ```

2. **Check Vite proxy configuration:**
   ```
   vite.config.ts should have:
   proxy: {
     '/api': {
       target: 'http://localhost:8000',
       changeOrigin: true
     }
   }
   ```

3. **Check CORS settings:**
   Backend `.env` should include:
   ```
   CORS_ORIGINS=http://localhost:3000,http://localhost:5173
   ```

4. **Check browser console:**
   Look for CORS errors and network errors

### TypeScript Errors
```bash
# TypeScript strict mode may flag issues
# Disable in tsconfig.json if needed:
"strict": false  # Not recommended for production
```

## API Integration

### How the Frontend Calls the Backend

1. **User inputs resume and job description**
2. **Clicks "Analyze Resume"**
3. **Frontend calls `analyzeResume()` from `api.ts`**
4. **Axios sends POST to `http://localhost:8000/api/analyze`**
5. **Backend processes request**
6. **Frontend displays results in tabs**

### Environment Configuration

The frontend looks for backend at:
```
http://localhost:8000/api/*
```

This is configured in `vite.config.ts` proxy settings.

For production, update the API base:
```typescript
const API_BASE = process.env.REACT_APP_API_URL || '/api';
```

## Features

### Real-time Analysis
- Resume and job description sync automatically
- Character count updates as you type
- File upload support with instant text extraction

### Visual Analysis Results
- **Compatibility Score**: 0-100 ATS score
- **Keyword Match**: Percentage with breakdown
- **Priority Badges**: High/Medium/Low indicators
- **Responsive Layout**: Works on desktop and tablet

### Interactive Tabs
- Tab navigation between analysis views
- Smooth transitions between tabs
- Organized information display

## Performance Tips

### Optimize Bundle Size
```bash
# Analyze bundle
npm run build -- --outDir dist

# Use production build preview
npm run preview
```

### Code Splitting
Vite automatically splits chunks. For manual optimization:
```typescript
// Dynamic imports
const AnalysisResults = React.lazy(() => 
  import('./components/AnalysisResults')
);
```

### Image Optimization
Replace placeholder images with optimized versions:
```bash
# Use images smaller than 20kb
# Use modern formats: WebP, AVIF
```

## Development Workflow

### Testing During Development
1. **Open DevTools**: F12 or Right-click → Inspect
2. **Network tab**: Monitor API calls
3. **Console tab**: Check for JavaScript errors
4. **React DevTools**: Debug component state

### Hot Module Replacement (HMR)
Vite provides instant refresh:
- Edit component → See changes immediately
- Preserve component state across edits
- Only affected modules reload

### Debugging Tips
```typescript
// Log API responses
const data = await analyzeResume(...);
console.log('Analysis result:', data);

// Check state changes
console.log('Results:', results);
console.log('Loading:', loading);
```

## Production Build

### Generate Optimized Build
```bash
npm run build
```

Creates `dist/` folder with:
- Minified JavaScript
- Optimized CSS
- Source maps (for debugging)
- Asset hashing (for caching)

### Deploy to Production

#### GitHub Pages
```bash
npm run build
# Deploy dist/ folder to GitHub Pages
```

#### Vercel
```bash
# Connect GitHub repo to Vercel
# Commits to main trigger auto-deployment
```

#### Traditional Server
```bash
# Build
npm run build

# Copy dist/ to web server
scp -r dist/* user@server:/var/www/app
```

## Environment Variables

Create `.env.local` for local overrides:
```
VITE_API_URL=http://localhost:8000
```

Use in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

---

**Frontend ready for development! 🎨**
