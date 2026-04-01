import { NextRequest, NextResponse } from 'next/server';
import { getOpenAIClient } from '@/lib/openai';
import { parseResumeFile } from '@/lib/resumeParser';
import { buildJobAnalysisPrompt } from '@/lib/prompts';
import { JobAnalysis } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const jobDescription = formData.get('jobDescription') as string;
    const resumeFile = formData.get('resumeFile') as File | null;
    const resumeText = formData.get('resumeText') as string | null;

    if (!jobDescription) {
      return NextResponse.json({ error: 'Job description is required' }, { status: 400 });
    }

    let parsedResumeText = resumeText || '';

    if (resumeFile && resumeFile.size > 0) {
      const buffer = Buffer.from(await resumeFile.arrayBuffer());
      parsedResumeText = await parseResumeFile(buffer, resumeFile.type);
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

    const prompt = buildJobAnalysisPrompt(jobDescription);
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert job description analyzer. Always return valid JSON only, no markdown formatting.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    const responseText = completion.choices[0]?.message?.content || '';
    
    let jobAnalysis: JobAnalysis;
    try {
      jobAnalysis = JSON.parse(responseText);
    } catch (_err) {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jobAnalysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error(`Failed to parse job analysis response. Raw response: ${responseText.substring(0, 200)}`);
      }
    }

    return NextResponse.json({
      jobAnalysis,
      resumeText: parsedResumeText,
    });
  } catch (error) {
    console.error('Analyze error:', error);
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
