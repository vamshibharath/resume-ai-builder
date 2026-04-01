'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, Tag } from 'lucide-react';
import { KeywordAnalysis as KeywordAnalysisType } from '@/types';

interface KeywordAnalysisProps {
  keywords: KeywordAnalysisType[];
}

export default function KeywordAnalysis({ keywords }: KeywordAnalysisProps) {
  const [filter, setFilter] = useState<'all' | 'found' | 'missing'>('all');

  const foundKeywords = keywords.filter(k => k.found);
  const missingKeywords = keywords.filter(k => !k.found);

  const filteredKeywords = filter === 'all'
    ? keywords
    : filter === 'found'
    ? foundKeywords
    : missingKeywords;

  const coverage = keywords.length > 0
    ? Math.round((foundKeywords.length / keywords.length) * 100)
    : 0;

  return (
    <div className="space-y-4">
      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gray-800 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-white">{keywords.length}</p>
          <p className="text-xs text-gray-400 mt-1">Total Keywords</p>
        </div>
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-green-400">{foundKeywords.length}</p>
          <p className="text-xs text-gray-400 mt-1">Found</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-red-400">{missingKeywords.length}</p>
          <p className="text-xs text-gray-400 mt-1">Missing</p>
        </div>
      </div>

      {/* Coverage bar */}
      <div className="bg-gray-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-300 flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Keyword Coverage in Optimized Resume
          </span>
          <span className="text-sm font-bold text-white">{coverage}%</span>
        </div>
        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-1000"
            style={{ width: `${coverage}%` }}
          />
        </div>
      </div>

      {/* Filter buttons */}
      <div className="flex gap-2">
        {(['all', 'found', 'missing'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            {f === 'all' ? `All (${keywords.length})` : f === 'found' ? `Found (${foundKeywords.length})` : `Added (${missingKeywords.length})`}
          </button>
        ))}
      </div>

      {/* Keywords grid */}
      <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
        {filteredKeywords.map((kw, i) => (
          <div
            key={i}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              kw.found
                ? 'bg-green-500/15 border border-green-500/30 text-green-300'
                : 'bg-red-500/15 border border-red-500/30 text-red-300'
            }`}
            title={kw.context || (kw.found ? 'Found in optimized resume' : 'Added to optimized resume')}
          >
            {kw.found ? (
              <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
            ) : (
              <XCircle className="w-3 h-3 text-red-400 flex-shrink-0" />
            )}
            {kw.keyword}
          </div>
        ))}
      </div>
      
      <p className="text-xs text-gray-500">
        <span className="text-green-400">Green</span> = found in optimized resume · 
        <span className="text-red-400 ml-1">Red</span> = not found in optimized resume
      </p>
    </div>
  );
}
