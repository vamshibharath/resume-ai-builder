'use client';

import { useState } from 'react';
import { Copy, Download, CheckCheck, FileText, Zap, Tag } from 'lucide-react';
import { OptimizationResult } from '@/types';
import ScoreCard from './ScoreCard';
import KeywordAnalysis from './KeywordAnalysis';

interface OptimizationResultsProps {
  result: OptimizationResult;
  onReset: () => void;
}

type Tab = 'resume' | 'changes' | 'keywords';

export default function OptimizationResults({ result, onReset }: OptimizationResultsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('resume');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result.optimizedResume);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([result.optimizedResume], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `optimized-resume-${result.jobAnalysis.detectedRole.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'resume', label: 'Optimized Resume', icon: <FileText className="w-4 h-4" /> },
    { id: 'changes', label: 'Changes Made', icon: <Zap className="w-4 h-4" /> },
    { id: 'keywords', label: 'Keyword Analysis', icon: <Tag className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Optimization Complete! 🎉</h2>
          <p className="text-gray-400 mt-1">
            Your resume has been optimized for{' '}
            <span className="text-blue-400 font-medium">{result.jobAnalysis.detectedRole}</span>
            {result.jobAnalysis.companyName && (
              <> at <span className="text-purple-400 font-medium">{result.jobAnalysis.companyName}</span></>
            )}
          </p>
        </div>
        <button
          onClick={onReset}
          className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800 transition-all text-sm"
        >
          Optimize Another Resume
        </button>
      </div>

      {/* Score card */}
      <ScoreCard
        atsScore={result.atsScore}
        keywordCoverage={result.keywordCoverage}
        detectedRole={result.jobAnalysis.detectedRole}
        seniorityLevel={result.jobAnalysis.seniorityLevel}
      />

      {/* Tabs */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="flex border-b border-gray-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'text-white border-b-2 border-blue-500 bg-gray-800/50'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/30'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Resume Tab */}
          {activeTab === 'resume' && (
            <div className="space-y-4">
              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-all text-sm"
                >
                  {copied ? (
                    <>
                      <CheckCheck className="w-4 h-4 text-green-400" />
                      <span className="text-green-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy to Clipboard
                    </>
                  )}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all text-sm"
                >
                  <Download className="w-4 h-4" />
                  Download .txt
                </button>
              </div>
              <textarea
                readOnly
                value={result.optimizedResume}
                className="w-full h-[600px] px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-300 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
          )}

          {/* Changes Tab */}
          {activeTab === 'changes' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  Optimizations Applied
                </h3>
                <ul className="space-y-2">
                  {result.improvements.map((improvement, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                      <span className="mt-0.5 w-5 h-5 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-400 text-xs flex items-center justify-center flex-shrink-0 font-medium">
                        {i + 1}
                      </span>
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>

              {result.scenarioPoints.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-400" />
                    Experience Scenarios Added
                  </h3>
                  <ul className="space-y-2">
                    {result.scenarioPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                        <span className="mt-0.5 w-5 h-5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-400 text-xs flex items-center justify-center flex-shrink-0 font-medium">
                          {i + 1}
                        </span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold text-white mb-3">Tech Stack Detected</h3>
                <div className="flex flex-wrap gap-2">
                  {result.jobAnalysis.techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Keywords Tab */}
          {activeTab === 'keywords' && (
            <KeywordAnalysis keywords={result.keywordAnalysis} />
          )}
        </div>
      </div>
    </div>
  );
}
