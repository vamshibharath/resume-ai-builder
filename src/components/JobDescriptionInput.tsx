'use client';

import { FileText } from 'lucide-react';

interface JobDescriptionInputProps {
  jobDescription: string;
  companyName: string;
  onJobDescriptionChange: (value: string) => void;
  onCompanyNameChange: (value: string) => void;
}

export default function JobDescriptionInput({
  jobDescription,
  companyName,
  onJobDescriptionChange,
  onCompanyNameChange,
}: JobDescriptionInputProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <FileText className="w-5 h-5 text-blue-400" />
        <h2 className="text-lg font-semibold text-white">Job Description</h2>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Company Name <span className="text-gray-500">(optional - auto-detected from JD)</span>
        </label>
        <input
          type="text"
          value={companyName}
          onChange={(e) => onCompanyNameChange(e.target.value)}
          placeholder="e.g., Google, Microsoft, Startup Inc."
          className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Job Description <span className="text-red-400">*</span>
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => onJobDescriptionChange(e.target.value)}
          placeholder="Paste the full job description here. The more detail you provide, the better the optimization will be.&#10;&#10;Include:&#10;• Job title and responsibilities&#10;• Required skills and technologies&#10;• Preferred qualifications&#10;• Company description"
          rows={12}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-sm leading-relaxed"
        />
        <p className="mt-1.5 text-xs text-gray-500">
          {jobDescription.length} characters · Aim for complete job descriptions for best results
        </p>
      </div>
    </div>
  );
}
