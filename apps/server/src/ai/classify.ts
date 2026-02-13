// Mock classification - in production, this would call an LLM API
export async function classifyContent(content: string): Promise<string> {
  // Simple keyword-based classification for mock
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('tech') || lowerContent.includes('プログラミング') || lowerContent.includes('開発')) {
    return 'テクノロジー';
  } else if (lowerContent.includes('business') || lowerContent.includes('ビジネス') || lowerContent.includes('経営')) {
    return 'ビジネス';
  } else if (lowerContent.includes('design') || lowerContent.includes('デザイン') || lowerContent.includes('ui')) {
    return 'デザイン';
  } else if (lowerContent.includes('learn') || lowerContent.includes('勉強') || lowerContent.includes('学習')) {
    return '学習';
  }
  
  return '一般';
}

// Mock tag generation - in production, this would call an LLM API
export async function generateTags(content: string): Promise<string[]> {
  const tags: string[] = [];
  const lowerContent = content.toLowerCase();
  
  // Simple keyword extraction for mock
  const keywords = [
    { word: 'react', tag: 'React' },
    { word: 'typescript', tag: 'TypeScript' },
    { word: 'ai', tag: 'AI' },
    { word: 'design', tag: 'デザイン' },
    { word: 'business', tag: 'ビジネス' },
    { word: 'javascript', tag: 'JavaScript' },
    { word: 'python', tag: 'Python' },
  ];
  
  for (const { word, tag } of keywords) {
    if (lowerContent.includes(word)) {
      tags.push(tag);
    }
  }
  
  return tags.length > 0 ? tags : ['未分類'];
}
