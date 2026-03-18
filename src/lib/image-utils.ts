/**
 * Image URL Utilities
 * Handles conversion and validation of image URLs from various sources
 */

export function isSafeUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

export function extractGoogleDriveId(url: string): string | null {
  // Match /d/FILE_ID/ or id=FILE_ID
  const match1 = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match1) return match1[1];
  const match2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (match2) return match2[1];
  return null;
}

export function convertGoogleDriveUrlToEmbedUrl(url: string): string {
  // Auto-convert Google Drive link format untuk embed
  // Input: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  // Output: https://drive.google.com/uc?id=FILE_ID&export=view
  const fileId = extractGoogleDriveId(url);
  if (fileId) {
    return `https://drive.google.com/uc?id=${fileId}&export=download`;
  }
  return url; // Return original jika tidak bisa extract ID
}

export function getGoogleDrivePreviewUrl(url: string): string {
  // Format untuk iframe preview
  const fileId = extractGoogleDriveId(url);
  if (fileId) {
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }
  return url;
}

export function isInstagramUrl(url: string): boolean {
  return url.includes("instagram.com") || url.includes("instagr.am");
}

export function isDirectImageUrl(url: string): boolean {
  return /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/i.test(url);
}

export function extractInstagramPostId(url: string): string | null {
  // Extract post ID from Instagram URLs
  // Format: https://www.instagram.com/p/POST_ID/ or https://www.instagram.com/reel/REEL_ID/
  const match = url.match(/(?:instagram\.com|instagr\.am)\/(?:p|reel)\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

export function isImageUrl(url: string): boolean {
  if (!isSafeUrl(url)) return false;
  if (extractGoogleDriveId(url)) return true;
  if (isDirectImageUrl(url)) return true;
  return false;
}
