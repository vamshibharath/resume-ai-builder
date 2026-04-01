import { NextRequest, NextResponse } from 'next/server';
import { getOpenAIClient } from '@/lib/openai';
import { buildResumeOptimizationPrompt, buildKeywordCheckPrompt } from '@/lib/prompts';
import { JobAnalysis, KeywordAnalysis, OptimizationResult } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobDescription, resumeText, jobAnalysis } = body as {
      jobDescription: string;
      resumeText: string;
      jobAnalysis: JobAnalysis;
    };

    if (!jobDescription || !resumeText || !jobAnalysis) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let openai;
    try {
      openai = getOpenAIClient();
    } catch (_err) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your .env.local file.' },
        { status: 503 }
      );
    }

    const optimizationPrompt = buildResumeOptimizationPrompt(jobDescription, resumeText, jobAnalysis);
    
    const optimizationCompletion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert resume writer and ATS optimization specialist. Produce professional, polished resumes that pass ATS systems with maximum keyword coverage.',
        },
        {
          role: 'user',
          content: optimizationPrompt,
        },
      ],
      temperature: 0.4,
      max_tokens: 4000,
    });

    const optimizedResume = optimizationCompletion.choices[0]?.message?.content || '';

    const keywordCheckPrompt = buildKeywordCheckPrompt(optimizedResume, jobAnalysis.atsKeywords);
    
    const keywordCompletion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a keyword analysis tool. Return only valid JSON arrays.',
        },
        {
          role: 'user',
          content: keywordCheckPrompt,
        },
      ],
      temperature: 0.1,
      max_tokens: 2000,
    });

    const keywordResponseText = keywordCompletion.choices[0]?.message?.content || '[]';
    
    let keywordAnalysis: KeywordAnalysis[] = [];
    try {
      keywordAnalysis = JSON.parse(keywordResponseText);
    } catch (_err) {
      const jsonMatch = keywordResponseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          keywordAnalysis = JSON.parse(jsonMatch[0]);
        } catch (parseErr) {
          console.error('Failed to parse keyword analysis fallback JSON:', parseErr);
        }
      } else {
        console.error('No JSON array found in keyword analysis response');
      }
    }

    const foundCount = keywordAnalysis.filter(k => k.found).length;
    const keywordCoverage = keywordAnalysis.length > 0
      ? Math.round((foundCount / keywordAnalysis.length) * 100)
      : 0;

    // Scoring weights: keywords (60%), tech stack coverage (30%), minimum length bonus (10%)
    const KEYWORD_WEIGHT = 0.6;
    const TECH_STACK_WEIGHT = 0.3;
    const LENGTH_BONUS = 10;
    const MIN_RESUME_LENGTH = 500;

    const techStackCoverage = (jobAnalysis.techStack.filter(tech =>
      optimizedResume.toLowerCase().includes(tech.toLowerCase())
    ).length / Math.max(jobAnalysis.techStack.length, 1)) * 100;

    const atsScore = Math.round(
      keywordCoverage * KEYWORD_WEIGHT +
      techStackCoverage * TECH_STACK_WEIGHT +
      (optimizedResume.length > MIN_RESUME_LENGTH ? LENGTH_BONUS : 0)
    );

    const improvements = [
      `Resume title updated to match: ${jobAnalysis.detectedRole}`,
      `${foundCount} of ${jobAnalysis.atsKeywords.length} ATS keywords incorporated`,
      `Tech stack aligned: ${jobAnalysis.techStack.slice(0, 5).join(', ')}${jobAnalysis.techStack.length > 5 ? '...' : ''}`,
      'Professional summary rewritten with role-specific positioning',
      'Work experience bullets enhanced with STAR format and metrics',
      'Skills section reorganized to prioritize job-relevant technologies',
    ];

    const scenarioPoints = jobAnalysis.keyResponsibilities.map(
      resp => `Crafted experience bullet matching responsibility: "${resp.substring(0, 80)}${resp.length > 80 ? '...' : ''}"`
    );

    const result: OptimizationResult = {
      jobAnalysis,
      optimizedResume,
      keywordCoverage,
      keywordAnalysis,
      atsScore: Math.min(atsScore, 100),
      improvements,
      scenarioPoints,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Optimize error:', error);
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
