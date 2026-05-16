const BLOCKED_HINTS = [
  'fuck',
  'shit',
  'bitch',
  'ass',
  'cunt',
  'dick',
  'cock',
  'pussy',
  'rape',
  'madarchod',
  'bhenchod',
  'chutiya',
  'randi',
  'gaand',
  'lund',
  'punda'
];

const PARTIAL_HINTS = ['bhenc'];

function normaliseUsername(username) {
  return String(username || '')
    .toLowerCase()
    .replace(/0/g, 'o')
    .replace(/1/g, 'i')
    .replace(/3/g, 'e')
    .replace(/4/g, 'a')
    .replace(/5/g, 's')
    .replace(/8/g, 'b')
    .replace(/@/g, 'a')
    .replace(/\$/g, 's')
    .replace(/[-_]/g, '')
    .replace(/(.)\1+/g, '$1');
}

export function looksProblematic(username) {
  const raw = String(username || '').toLowerCase();
  const normalised = normaliseUsername(raw);

  return PARTIAL_HINTS.some((word) => raw.includes(word) || normalised.includes(normaliseUsername(word))) || BLOCKED_HINTS.some((word) => {
    const normalisedWord = normaliseUsername(word);
    return raw.includes(word) || normalised.includes(normalisedWord);
  });
}
