export function analyseUpiId(upiId) {
  if (typeof upiId !== 'string' || !upiId.includes('@')) {
    return { valid: false };
  }

  const parts = upiId.split('@');
  const localPart = parts[0];
  const handle = parts[1];
  const digitsOnly = localPart.replace(/\D/g, '');
  const isPhoneLike = digitsOnly.length >= 10 && /^\d+$/.test(localPart);

  return {
    valid: true,
    isPhoneNumber: isPhoneLike,
    localPart,
    handle,
    privacyRisk: isPhoneLike ? 'high' : 'low'
  };
}
