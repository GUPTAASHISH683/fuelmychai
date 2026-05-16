export async function generateFingerprint() {
  const screenSize = `${window.screen?.width || 0}x${window.screen?.height || 0}`;
  const raw = [
    navigator.userAgent || '',
    navigator.language || '',
    navigator.platform || '',
    screenSize,
    window.screen?.colorDepth || 0,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency || 0,
    navigator.deviceMemory || 0
  ].join('|');

  const encoder = new TextEncoder();
  const data = encoder.encode(raw);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
}
