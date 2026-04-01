import OpenAI from 'openai';

export function getOpenAIClient(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured. Please set it in your .env.local file.');
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}
