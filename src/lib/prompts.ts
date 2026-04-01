import { JobAnalysis } from '@/types';

export function buildJobAnalysisPrompt(jobDescription: string): string {
  return `Analyze this job description and extract all relevant information.

JOB DESCRIPTION:
${jobDescription}

Extract and return a JSON object with this EXACT structure (no markdown, just raw JSON):
{
  "detectedRole": "exact job title/role",
  "companyName": "company name or empty string if not found",
  "seniorityLevel": "junior|mid|senior|lead|principal",
  "requiredSkills": ["skill1", "skill2", "skill3"],
  "techStack": ["language/framework/tool1", "language/framework/tool2"],
  "keyResponsibilities": ["responsibility1", "responsibility2"],
  "atsKeywords": ["keyword1", "keyword2", "keyword3"]
}

Instructions:
- detectedRole: The exact job title as stated in the JD
- companyName: Extract from the description, or return empty string
- seniorityLevel: Infer from context (years required, level mentioned)
- requiredSkills: All skills explicitly required or preferred
- techStack: All technologies, frameworks, languages, tools, databases, cloud services mentioned
- keyResponsibilities: Top 6-8 key responsibilities in concise form
- atsKeywords: EVERY important term an ATS would scan for - include role variations, skills, technologies, methodologies, certifications, soft skills. Be exhaustive, aim for 30-50 keywords.

Return ONLY the JSON object, no other text.`;
}

export function buildResumeOptimizationPrompt(
  jobDescription: string,
  resumeText: string,
  jobAnalysis: JobAnalysis
): string {
  return `You are an expert ATS optimization specialist and professional resume writer with 15+ years of experience helping candidates land jobs at top companies.

JOB DESCRIPTION:
${jobDescription}

JOB ANALYSIS:
- Role: ${jobAnalysis.detectedRole}
- Seniority: ${jobAnalysis.seniorityLevel}
- Company: ${jobAnalysis.companyName || 'Not specified'}
- Tech Stack: ${jobAnalysis.techStack.join(', ')}
- Required Skills: ${jobAnalysis.requiredSkills.join(', ')}
- ATS Keywords Required: ${jobAnalysis.atsKeywords.join(', ')}
- Key Responsibilities: 
${jobAnalysis.keyResponsibilities.map((r, i) => `  ${i + 1}. ${r}`).join('\n')}

ORIGINAL RESUME:
${resumeText}

OPTIMIZATION INSTRUCTIONS:
1. TITLE/HEADLINE: Change the professional title/headline to EXACTLY match "${jobAnalysis.detectedRole}"

2. PROFESSIONAL SUMMARY: Rewrite the summary to:
   - Open with the exact role name "${jobAnalysis.detectedRole}"
   - Include at least 6-8 of the most important ATS keywords naturally
   - Mention the seniority level and years of experience
   - Position candidate as ideal for this specific role

3. ATS KEYWORDS: Include EVERY SINGLE keyword from this list naturally throughout the resume:
   ${jobAnalysis.atsKeywords.join(', ')}

4. TECH STACK ALIGNMENT: Ensure these technologies appear prominently:
   ${jobAnalysis.techStack.join(', ')}

5. WORK EXPERIENCE - For each existing job, enhance bullet points by:
   - Using STAR format (Situation->Task->Action->Result) 
   - Adding quantified metrics (%, $, time saved, users affected, scale)
   - Naturally weaving in ATS keywords and tech stack items
   - Matching scenarios to the job's key responsibilities
   - Keep original company names, titles, and dates - only enhance the bullets

6. SKILLS SECTION: Reorganize to lead with skills matching the job's tech stack. Group by category.

7. FORMATTING:
   - Use clear section headers: PROFESSIONAL SUMMARY, WORK EXPERIENCE, SKILLS, EDUCATION, etc.
   - Use bullet points starting with strong action verbs
   - Keep consistent formatting throughout
   - Ensure the resume reads naturally and professionally

8. SCENARIO GENERATION: For each of these responsibilities, ensure there's a matching bullet point in the experience section:
${jobAnalysis.keyResponsibilities.map((r, i) => `   ${i + 1}. ${r}`).join('\n')}

Return ONLY the complete optimized resume text, properly formatted with clear sections, ready to paste into a document. Do not include any commentary or explanation - just the resume content.`;
}

export function buildKeywordCheckPrompt(
  resumeText: string,
  keywords: string[]
): string {
  return `Check which of these ATS keywords appear in the resume text below.

RESUME:
${resumeText}

KEYWORDS TO CHECK:
${keywords.join(', ')}

Return a JSON array where each element has:
{
  "keyword": "the keyword",
  "found": true/false,
  "context": "brief quote showing where it appears, or null if not found"
}

Return ONLY the JSON array, no other text.`;
}
