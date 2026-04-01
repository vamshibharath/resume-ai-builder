'use client';

interface ScoreCardProps {
  atsScore: number;
  keywordCoverage: number;
  detectedRole: string;
  seniorityLevel: string;
}

function CircularProgress({ value, size = 120, strokeWidth = 10, color }: {
  value: number;
  size?: number;
  strokeWidth?: number;
  color: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#1f2937"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
      />
    </svg>
  );
}

function getScoreColor(score: number): string {
  if (score >= 80) return '#22c55e';
  if (score >= 60) return '#eab308';
  return '#ef4444';
}

function getScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Needs Work';
}

export default function ScoreCard({
  atsScore,
  keywordCoverage,
  detectedRole,
  seniorityLevel,
}: ScoreCardProps) {
  const atsColor = getScoreColor(atsScore);
  const kwColor = getScoreColor(keywordCoverage);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-white mb-1">ATS Score Analysis</h3>
      <p className="text-sm text-gray-400 mb-6">
        Optimized for: <span className="text-blue-400 font-medium">{detectedRole}</span>
        {seniorityLevel && (
          <span className="ml-2 px-2 py-0.5 rounded-full bg-gray-800 text-gray-300 text-xs capitalize">
            {seniorityLevel}
          </span>
        )}
      </p>

      <div className="grid grid-cols-2 gap-6">
        {/* ATS Score */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <CircularProgress value={atsScore} color={atsColor} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-white">{atsScore}</span>
              <span className="text-xs text-gray-400">/ 100</span>
            </div>
          </div>
          <div className="mt-3 text-center">
            <p className="text-sm font-semibold text-white">ATS Score</p>
            <p className="text-xs mt-0.5" style={{ color: atsColor }}>
              {getScoreLabel(atsScore)}
            </p>
          </div>
        </div>

        {/* Keyword Coverage */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <CircularProgress value={keywordCoverage} color={kwColor} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-white">{keywordCoverage}%</span>
            </div>
          </div>
          <div className="mt-3 text-center">
            <p className="text-sm font-semibold text-white">Keyword Coverage</p>
            <p className="text-xs mt-0.5" style={{ color: kwColor }}>
              {getScoreLabel(keywordCoverage)}
            </p>
          </div>
        </div>
      </div>

      {/* Score breakdown */}
      <div className="mt-6 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">ATS Compatibility</span>
          <div className="flex items-center gap-2">
            <div className="w-32 h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${atsScore}%`, backgroundColor: atsColor }}
              />
            </div>
            <span className="text-white font-medium w-8">{atsScore}%</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">Keyword Match</span>
          <div className="flex items-center gap-2">
            <div className="w-32 h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${keywordCoverage}%`, backgroundColor: kwColor }}
              />
            </div>
            <span className="text-white font-medium w-8">{keywordCoverage}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
