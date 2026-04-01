import React, { useState } from 'react';
import { Upload, Zap } from 'lucide-react';
import '../styles/FileUpload.css';

interface FileUploadProps {
  onResumeText: (text: string) => void;
  onJobDescription: (text: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onResumeText, onJobDescription }) => {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  const handleResumeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setResumeText(text);
    onResumeText(text);
  };

  const handleJobChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setJobDescription(text);
    onJobDescription(text);
  };

  const handleResumeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const text = await file.text();
        setResumeText(text);
        onResumeText(text);
      } catch (error) {
        console.error('Error reading file:', error);
      }
    }
  };

  const handleJobFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const text = await file.text();
        setJobDescription(text);
        onJobDescription(text);
      } catch (error) {
        console.error('Error reading file:', error);
      }
    }
  };

  return (
    <div className="file-upload-container">
      <div className="upload-header">
        <Zap className="header-icon" />
        <h1>Resume AI Builder</h1>
        <p>Upload your resume and job description to get AI-powered optimization suggestions</p>
      </div>

      <div className="upload-grid">
        <div className="upload-section">
          <h2>Your Resume</h2>
          <label className="file-input-label">
            <input type="file" accept=".txt,.pdf,.docx" onChange={handleResumeFile} />
            <Upload size={24} />
            <span>Upload Resume File</span>
          </label>
          <p>or paste your resume:</p>
          <textarea
            className="resume-textarea"
            placeholder="Paste your resume here..."
            value={resumeText}
            onChange={handleResumeChange}
          />
          <div className="char-count">{resumeText.length} characters</div>
        </div>

        <div className="upload-section">
          <h2>Job Description</h2>
          <label className="file-input-label">
            <input type="file" accept=".txt,.pdf" onChange={handleJobFile} />
            <Upload size={24} />
            <span>Upload Job Description</span>
          </label>
          <p>or paste the job description:</p>
          <textarea
            className="resume-textarea"
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={handleJobChange}
          />
          <div className="char-count">{jobDescription.length} characters</div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
