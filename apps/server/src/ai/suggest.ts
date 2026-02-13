import { Priority } from '@copilot-2nd-brain/shared';

// Mock priority detection - in production, this would call an LLM API
export async function detectPriority(content: string): Promise<Priority> {
  const lowerContent = content.toLowerCase();
  
  // Simple keyword-based priority detection
  if (lowerContent.includes('urgent') || lowerContent.includes('緊急') || lowerContent.includes('asap')) {
    return Priority.URGENT;
  } else if (lowerContent.includes('important') || lowerContent.includes('重要') || lowerContent.includes('high priority')) {
    return Priority.HIGH;
  } else if (lowerContent.includes('low priority') || lowerContent.includes('低優先度')) {
    return Priority.LOW;
  }
  
  return Priority.MEDIUM;
}

// Mock next action suggestion - in production, this would call an LLM API
export async function suggestNextActions(sources: any[]): Promise<any[]> {
  if (sources.length === 0) return [];
  
  // Mock: generate a simple next action based on recent sources
  const recentSource = sources[0];
  
  return [
    {
      title: `${recentSource.category || '一般'}の学習を深める`,
      description: `最近保存した「${recentSource.content.substring(0, 30)}...」に関連する情報をさらに収集しましょう。`,
      reason: `このトピックに関心を示しているため、より深い理解を得ることで知識を拡張できます。`,
      category: 'learning',
      priority: Priority.MEDIUM,
      relatedSourceIds: [recentSource.id],
    },
  ];
}
