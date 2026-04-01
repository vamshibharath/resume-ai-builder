'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, AlignLeft } from 'lucide-react';

interface ResumeUploadProps {
  onFileChange: (file: File | null) => void;
  onTextChange: (text: string) => void;
  resumeText: string;
  resumeFile: File | null;
}

export default function ResumeUpload({
  onFileChange,
  onTextChange,
  resumeText,
  resumeFile,
}: ResumeUploadProps) {
  const [mode, setMode] = useState<'upload' | 'paste'>('upload');

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileChange(acceptedFiles[0]);
      }
    },
    [onFileChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const removeFile = () => {
    onFileChange(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Upload className="w-5 h-5 text-purple-400" />
        <h2 className="text-lg font-semibold text-white">Your Resume</h2>
      </div>

      {/* Mode Toggle */}
      <div className="flex rounded-lg border border-gray-700 p-1 bg-gray-800/50 w-fit">
        <button
          onClick={() => setMode('upload')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            mode === 'upload'
              ? 'bg-gray-700 text-white shadow-sm'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <Upload className="w-4 h-4" />
          Upload File
        </button>
        <button
          onClick={() => setMode('paste')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            mode === 'paste'
              ? 'bg-gray-700 text-white shadow-sm'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <AlignLeft className="w-4 h-4" />
          Paste Text
        </button>
      </div>

      {mode === 'upload' ? (
        <div>
          {!resumeFile ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                isDragActive
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-gray-700 hover:border-gray-600 bg-gray-800/30 hover:bg-gray-800/50'
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 rounded-full bg-gray-700">
                  <Upload className="w-6 h-6 text-gray-400" />
                </div>
                {isDragActive ? (
                  <p className="text-purple-400 font-medium">Drop your resume here</p>
                ) : (
                  <>
                    <div>
                      <p className="text-gray-300 font-medium">
                        Drag &amp; drop your resume here
                      </p>
                      <p className="text-gray-500 text-sm mt-1">
                        or <span className="text-blue-400 underline">click to browse</span>
                      </p>
                    </div>
                    <p className="text-xs text-gray-600">
                      Supports PDF, DOCX, DOC, TXT · Max 10MB
                    </p>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 bg-gray-800 border border-gray-700 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <FileText className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{resumeFile.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(resumeFile.size)}</p>
                </div>
              </div>
              <button
                onClick={removeFile}
                className="p-1.5 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <textarea
            value={resumeText}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder="Paste your resume text here...&#10;&#10;Include all sections:&#10;• Contact information&#10;• Professional summary&#10;• Work experience&#10;• Skills&#10;• Education&#10;• Certifications"
            rows={12}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none text-sm leading-relaxed"
          />
          <p className="mt-1.5 text-xs text-gray-500">
            {resumeText.length} characters
          </p>
        </div>
      )}
    </div>
  );
}
