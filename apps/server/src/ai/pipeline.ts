import { MediaType, Priority } from '@copilot-2nd-brain/shared';
import { generateSummary } from './summarize';
import { classifyContent, generateTags } from './classify';
import { detectPriority } from './suggest';

export interface ProcessedSource {
  summary: string;
  category: string;
  aiTags: string[];
  priority: Priority;
}

// Main AI processing pipeline
export async function processSource(
  content: string,
  mediaType: MediaType
): Promise<ProcessedSource> {
  // Run all AI processing steps
  const [summary, category, aiTags, priority] = await Promise.all([
    generateSummary(content),
    classifyContent(content),
    generateTags(content),
    detectPriority(content),
  ]);

  return {
    summary,
    category,
    aiTags,
    priority,
  };
}

// Detect media type from content
export function detectMediaType(content: string, url?: string): MediaType {
  if (url) {
    if (url.includes('twitter.com') || url.includes('x.com')) {
      return MediaType.X_POST;
    }
    if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return MediaType.IMAGE;
    }
    if (url.match(/\.(mp4|mov|avi|webm)$/i)) {
      return MediaType.VIDEO;
    }
    if (url.match(/\.(mp3|wav|ogg)$/i)) {
      return MediaType.AUDIO;
    }
    if (url.match(/\.pdf$/i)) {
      return MediaType.PDF;
    }
    if (url.match(/\.md$/i)) {
      return MediaType.MARKDOWN;
    }
    return MediaType.LINK;
  }

  // Default to text memo
  return MediaType.TEXT_MEMO;
}
