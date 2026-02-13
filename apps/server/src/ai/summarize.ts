import { MediaType, Priority } from '@copilot-2nd-brain/shared';

// Mock summarization - in production, this would call an LLM API
export async function generateSummary(content: string): Promise<string> {
  // Simple mock: take first 100 characters
  const summary = content.length > 100 ? content.substring(0, 100) + '...' : content;
  return `要約: ${summary}`;
}
