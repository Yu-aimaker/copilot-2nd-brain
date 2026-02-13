import { MediaType } from '@copilot-2nd-brain/shared';

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

  return MediaType.TEXT_MEMO;
}
