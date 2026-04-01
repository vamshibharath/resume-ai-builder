import React, { useState } from 'react';
import { Send, AlertCircle } from 'lucide-react';
import { analyzeResume } from '../services/api';
import FileUpload from './components/FileUpload';
import AnalysisResults from './components/AnalysisResults';
import './styles/App.css';

function App() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [companyName, setCompanyName] = useState('');

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      setError('Please provide your resume');
      return;
    }
    if (!jobDescription.trim()) {
      setError('Please provide the job description');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await analyzeResume(resumeText, jobDescription, companyName);
      setResults(data);
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          'An error occurred during analysis. Make sure the backend is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <FileUpload onResumeText={setResumeText} onJobDescription={setJobDescription} />

      <div className="analysis-section">
        <div className="company-input">
          <label>
            <strong>Company Name (Optional)</strong>
            <input
              type="text"
              placeholder="e.g., Google, Microsoft, Startup"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </label>
        </div>

        {error && (
          <div className="error-message">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <button
          className="analyze-button"
          onClick={handleAnalyze}
          disabled={loading || !resumeText.trim() || !jobDescription.trim()}
        >
          <Send size={20} />
          {loading ? 'Analyzing...' : 'Analyze Resume'}
        </button>
      </div>

      {results && <AnalysisResults data={results} loading={loading} />}
    </div>
  );
}

export default App;
