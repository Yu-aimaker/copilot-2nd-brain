import { MediaType } from '@copilot-2nd-brain/shared';

export function detectMediaType(content: string, url?: string): MediaType {
  if (url) {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();
      
      // Check for X/Twitter posts
      if (hostname === 'twitter.com' || hostname === 'x.com' || 
          hostname === 'www.twitter.com' || hostname === 'www.x.com') {
        return MediaType.X_POST;
      }
      
      // Check file extensions
      const pathname = urlObj.pathname.toLowerCase();
      if (pathname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        return MediaType.IMAGE;
      }
      if (pathname.match(/\.(mp4|mov|avi|webm)$/i)) {
        return MediaType.VIDEO;
      }
      if (pathname.match(/\.(mp3|wav|ogg)$/i)) {
        return MediaType.AUDIO;
      }
      if (pathname.match(/\.pdf$/i)) {
        return MediaType.PDF;
      }
      if (pathname.match(/\.md$/i)) {
        return MediaType.MARKDOWN;
      }
      
      return MediaType.LINK;
    } catch (e) {
      // Invalid URL, treat as text
      return MediaType.TEXT_MEMO;
    }
  }

  return MediaType.TEXT_MEMO;
}
