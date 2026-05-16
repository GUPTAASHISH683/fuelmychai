export function getReferrerBucket(referrerHeader, utmSource) {
  if (utmSource) {
    const utmLower = String(utmSource).toLowerCase();

    if (utmLower.includes('instagram')) return 'instagram';
    if (utmLower.includes('youtube') || utmLower.includes('yt')) return 'youtube';
    if (utmLower.includes('twitter') || utmLower.includes('x.com')) return 'twitter';
    if (utmLower.includes('whatsapp') || utmLower.includes('wa')) return 'whatsapp';
    if (utmLower.includes('linkedin')) return 'linkedin';

    return 'other';
  }

  if (referrerHeader) {
    const ref = String(referrerHeader).toLowerCase();

    if (ref.includes('instagram.com')) return 'instagram';
    if (ref.includes('youtube.com') || ref.includes('youtu.be')) return 'youtube';
    if (ref.includes('twitter.com') || ref.includes('x.com')) return 'twitter';
    if (ref.includes('wa.me') || ref.includes('whatsapp')) return 'whatsapp';
    if (ref.includes('linkedin.com')) return 'linkedin';
    if (ref.includes('google.com')) return 'google';

    return 'other';
  }

  return 'direct';
}
