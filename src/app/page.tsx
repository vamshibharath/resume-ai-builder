'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import JobDescriptionInput from '@/components/JobDescriptionInput';
import ResumeUpload from '@/components/ResumeUpload';
import OptimizationResults from '@/components/OptimizationResults';
import { OptimizationResult } from '@/types';
import { Sparkles, AlertCircle, ChevronRight } from 'lucide-react';

type Step = 'input' | 'loading' | 'results';

const loadingMessages = [
  'Analyzing job description...',
  'Extracting ATS keywords...',
  'Detecting tech stack...',
  'Identifying key responsibilities...',
  'Optimizing resume content...',
  'Aligning with target role...',
  'Enhancing work experience bullets...',
  'Calculating ATS score...',
  'Finalizing optimized resume...',
];

export default function Home() {
  const [step, setStep] = useState<Step>('input');
  const [jobDescription, setJobDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  const handleSubmit = async () => {
    if (!jobDescription.trim()) {
      setError('Please provide a job description.');
      return;
    }
    if (!resumeFile && !resumeText.trim()) {
      setError('Please provide your resume (upload a file or paste text).');
      return;
    }

    setError(null);
    setStep('loading');
    setLoadingMessageIndex(0);

    const messageInterval = setInterval(() => {
      setLoadingMessageIndex(prev =>
        prev < loadingMessages.length - 1 ? prev + 1 : prev
      );
    }, 2000);

    try {
      // Step 1: Analyze
      const formData = new FormData();
      formData.append('jobDescription', jobDescription);
      if (resumeFile) {
        formData.append('resumeFile', resumeFile);
      } else {
        formData.append('resumeText', resumeText);
      }
      if (companyName) {
        formData.append('companyName', companyName);
      }

      const analyzeResponse = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!analyzeResponse.ok) {
        const data = await analyzeResponse.json();
        throw new Error(data.error || 'Analysis failed');
      }

      const { jobAnalysis, resumeText: parsedResumeText } = await analyzeResponse.json();

      // Step 2: Optimize
      const optimizeResponse = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobDescription,
          resumeText: parsedResumeText || resumeText,
          jobAnalysis,
        }),
      });

      if (!optimizeResponse.ok) {
        const data = await optimizeResponse.json();
        throw new Error(data.error || 'Optimization failed');
      }

      const optimizationResult: OptimizationResult = await optimizeResponse.json();
      setResult(optimizationResult);
      setStep('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setStep('input');
    } finally {
      clearInterval(messageInterval);
    }
  };

  const handleReset = () => {
    setStep('input');
    setResult(null);
    setError(null);
    setJobDescription('');
    setCompanyName('');
    setResumeFile(null);
    setResumeText('');
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero */}
        {step === 'input' && (
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered ATS Optimization
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Tailor Your Resume to{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Any Job Description
              </span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Upload your resume and paste a job description. Our AI extracts 100% of ATS keywords,
              aligns your experience, and generates an optimized resume that gets past applicant tracking systems.
            </p>
          </div>
        )}

        {/* Input Step */}
        {step === 'input' && (
          <div className="space-y-6">
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-300 font-medium">Error</p>
                  <p className="text-red-400/80 text-sm mt-1">{error}</p>
                  {error.includes('OPENAI_API_KEY') && (
                    <p className="text-gray-400 text-sm mt-2">
                      Add <code className="bg-gray-800 px-1 rounded text-yellow-400">OPENAI_API_KEY=your_key</code> to your{' '}
                      <code className="bg-gray-800 px-1 rounded text-yellow-400">.env.local</code> file and restart the server.
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <JobDescriptionInput
                  jobDescription={jobDescription}
                  companyName={companyName}
                  onJobDescriptionChange={setJobDescription}
                  onCompanyNameChange={setCompanyName}
                />
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <ResumeUpload
                  onFileChange={setResumeFile}
                  onTextChange={setResumeText}
                  resumeText={resumeText}
                  resumeFile={resumeFile}
                />
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={!jobDescription.trim() || (!resumeFile && !resumeText.trim())}
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:shadow-none text-lg"
              >
                <Sparkles className="w-5 h-5" />
                Analyze &amp; Optimize Resume
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
              {[
                { label: '100% ATS Keywords', desc: 'Every keyword extracted and included' },
                { label: 'Role Alignment', desc: 'Title and summary matched to JD' },
                { label: 'Tech Stack Match', desc: 'Skills aligned to company needs' },
                { label: 'ATS Score', desc: 'Quantified compatibility score' },
              ].map((feature) => (
                <div key={feature.label} className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                  <p className="text-sm font-semibold text-white">{feature.label}</p>
                  <p className="text-xs text-gray-500 mt-1">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loading Step */}
        {step === 'loading' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-gray-800 border-t-blue-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-xl font-semibold text-white">
                {loadingMessages[loadingMessageIndex]}
              </p>
              <p className="text-gray-500 text-sm">
                This typically takes 20-40 seconds
              </p>
            </div>
            <div className="flex gap-1.5">
              {loadingMessages.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i <= loadingMessageIndex ? 'bg-blue-500' : 'bg-gray-700'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Results Step */}
        {step === 'results' && result && (
          <OptimizationResults result={result} onReset={handleReset} />
        )}
      </main>
    </div>
  );
}
