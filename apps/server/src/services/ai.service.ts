import { MediaType, Priority } from '@2nd-brain/shared';

interface AIProcessingResult {
  summary: string;
  tags: string[];
  priority: Priority;
  mediaType: MediaType;
}

export class AIService {
  private apiKey: string;

  constructor(apiKey: string = process.env.OPENAI_API_KEY || '') {
    this.apiKey = apiKey;
  }

  async detectMediaType(content: string): Promise<MediaType> {
    // Auto-detect media type based on content
    // URL patterns
    if (content.match(/^https?:\/\//)) {
      if (content.match(/\.(jpg|jpeg|png|gif|webp)$/i)) return MediaType.IMAGE;
      if (content.match(/\.(mp4|mov|avi|webm)$/i)) return MediaType.VIDEO;
      if (content.match(/\.(mp3|wav|ogg)$/i)) return MediaType.AUDIO;
      if (content.match(/\.(pdf)$/i)) return MediaType.PDF;
      return MediaType.LINK;
    }

    // Code patterns
    if (content.match(/^```/) || content.includes('function ') || content.includes('const ')) {
      return MediaType.CODE;
    }

    // Default to text
    return MediaType.TEXT;
  }

  async processSource(content: string, mediaType?: MediaType): Promise<AIProcessingResult> {
    // Detect media type if not provided
    const detectedMediaType = mediaType || await this.detectMediaType(content);

    // In a real implementation, this would call OpenAI API
    // For now, we'll use simple rule-based processing
    const summary = this.generateSummary(content);
    const tags = this.extractTags(content);
    const priority = this.determinePriority(content);

    return {
      summary,
      tags,
      priority,
      mediaType: detectedMediaType,
    };
  }

  private generateSummary(content: string): string {
    // Simple summary - take first 100 characters or first sentence
    const firstSentence = content.match(/^[^.!?]+[.!?]/)?.[0];
    if (firstSentence && firstSentence.length <= 150) {
      return firstSentence.trim();
    }
    return content.substring(0, 100).trim() + (content.length > 100 ? '...' : '');
  }

  private extractTags(content: string): string[] {
    const tags: string[] = [];
    
    // Extract hashtags
    const hashtags = content.match(/#[\w]+/g);
    if (hashtags) {
      tags.push(...hashtags.map(tag => tag.substring(1).toLowerCase()));
    }

    // Extract common keywords (simple implementation)
    const keywords = ['important', 'urgent', 'meeting', 'idea', 'todo', 'research', 'review'];
    keywords.forEach(keyword => {
      if (content.toLowerCase().includes(keyword)) {
        tags.push(keyword);
      }
    });

    // Remove duplicates
    return [...new Set(tags)];
  }

  private determinePriority(content: string): Priority {
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('urgent') || lowerContent.includes('asap') || lowerContent.includes('!!!')) {
      return Priority.URGENT;
    }
    
    if (lowerContent.includes('important') || lowerContent.includes('priority')) {
      return Priority.HIGH;
    }
    
    if (lowerContent.includes('later') || lowerContent.includes('someday')) {
      return Priority.LOW;
    }
    
    return Priority.MEDIUM;
  }

  async generateReport(sources: any[], actions: any[], period: { start: Date; end: Date }): Promise<{
    title: string;
    content: string;
    insights: string[];
  }> {
    // Generate periodic report
    const title = `Report for ${period.start.toLocaleDateString()} - ${period.end.toLocaleDateString()}`;
    
    const insights = [
      `Collected ${sources.length} sources during this period`,
      `Generated ${actions.length} action items`,
      `Most common priority: ${this.getMostCommonPriority(sources)}`,
      `Most active project: ${this.getMostActiveProject(sources)}`,
    ];

    const content = this.generateReportContent(sources, actions, insights);

    return { title, content, insights };
  }

  private getMostCommonPriority(sources: any[]): string {
    const priorities = sources.map(s => s.priority);
    const counts = priorities.reduce((acc, p) => {
      acc[p] = (acc[p] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b, 'MEDIUM');
  }

  private getMostActiveProject(sources: any[]): string {
    const projects = sources.filter(s => s.projectId).map(s => s.projectId);
    if (projects.length === 0) return 'None';
    
    const counts = projects.reduce((acc, p) => {
      acc[p] = (acc[p] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b, 'Unknown');
  }

  private generateReportContent(sources: any[], actions: any[], insights: string[]): string {
    let content = '# Activity Summary\n\n';
    content += insights.map(i => `- ${i}`).join('\n');
    content += '\n\n## Key Highlights\n\n';
    content += '- Review your sources and actions for this period\n';
    content += '- Focus on high-priority items\n';
    content += '- Consider consolidating related items into projects\n';
    return content;
  }

  async suggestActions(sources: any[], existingActions: any[]): Promise<Array<{
    title: string;
    description: string;
    priority: Priority;
    sourceIds: string[];
  }>> {
    // Analyze sources and suggest actions
    const suggestions: Array<{
      title: string;
      description: string;
      priority: Priority;
      sourceIds: string[];
    }> = [];

    // Group sources by priority
    const highPrioritySources = sources.filter(s => s.priority === Priority.HIGH || s.priority === Priority.URGENT);
    
    if (highPrioritySources.length > 0) {
      suggestions.push({
        title: 'Review High Priority Items',
        description: `You have ${highPrioritySources.length} high-priority sources that need attention.`,
        priority: Priority.HIGH,
        sourceIds: highPrioritySources.map(s => s.id),
      });
    }

    // Suggest follow-ups for sources with specific tags
    const meetingSources = sources.filter(s => s.tags?.includes('meeting'));
    if (meetingSources.length > 0) {
      suggestions.push({
        title: 'Follow up on Meetings',
        description: 'Review meeting notes and create action items.',
        priority: Priority.MEDIUM,
        sourceIds: meetingSources.map(s => s.id),
      });
    }

    return suggestions;
  }
}

export const aiService = new AIService();
