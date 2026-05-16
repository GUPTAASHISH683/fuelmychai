export const HARD_BLOCKED_KEYWORDS = {
  medical_emergency: [
    'cancer',
    'tumor',
    'tumour',
    'surgery required',
    'hospital bills',
    'icu',
    'dialysis',
    'chemotherapy',
    'radiation therapy',
    'transplant',
    'operation cost',
    'medical bill',
    'medical emergency',
    'medical fund',
    'biopsy',
    'terminal illness',
    'life support',
    'ventilator',
    'kidney failure',
    'liver failure',
    'heart surgery',
    'brain surgery',
    'treatment cost',
    'medicine cost'
  ],
  donation_framing: [
    'please donate',
    'kindly donate',
    'help us raise',
    'donation needed',
    'need donations',
    'accepting donations',
    'crowdfund',
    'fundrais',
    'charity fund',
    'relief fund',
    'flood victim',
    'earthquake victim',
    'accident victim',
    'poor family',
    'struggling family',
    'below poverty',
    'no money for treatment',
    'cannot afford',
    'orphan',
    'destitute',
    'homeless family',
    'god will bless',
    'allah will reward',
    'karma will reward'
  ],
  urgency_manipulation: [
    'last chance to help',
    'running out of time',
    'days left to live',
    'critical condition',
    'life or death',
    'please share urgently',
    'share this widely',
    'only you can help',
    'dying',
    'if you care about me',
    'real fans will support',
    'prove you care',
    'prove your love'
  ],
  financial_fraud: [
    'double your money',
    'guaranteed returns',
    'investment opportunity',
    'passive income',
    'network marketing',
    'mlm',
    'multi level',
    'crypto signals',
    'bitcoin returns',
    'forex trading signals',
    'stock tips guaranteed',
    'earn from home scheme'
  ],
  adult_content: [
    'onlyfans',
    'adult content',
    'nsfw',
    'explicit content',
    'xxx content',
    'intimate videos',
    'adult videos'
  ]
};

export const SOFT_FLAG_KEYWORDS = [
  'sick',
  'ill',
  'disabled',
  'specially abled',
  'accident',
  'struggling',
  'in debt',
  'loan',
  'bankrupt',
  'hardship',
  'difficult time',
  'difficult times',
  'going through a lot',
  'help me'
];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function containsKeyword(text, keyword) {
  if (/^[a-z0-9]+$/.test(keyword) && keyword.length <= 3) {
    return new RegExp(`(^|[^a-z0-9])${escapeRegExp(keyword)}([^a-z0-9]|$)`).test(text);
  }

  return text.includes(keyword);
}

export function screenContent(text) {
  const lowercased = String(text || '').toLowerCase();

  for (const [categoryName, keywords] of Object.entries(HARD_BLOCKED_KEYWORDS)) {
    for (const keyword of keywords) {
      if (containsKeyword(lowercased, keyword)) {
        return {
          allowed: false,
          flagged: false,
          category: categoryName,
          matched: keyword,
          reason: 'Content not permitted on this platform'
        };
      }
    }
  }

  for (const keyword of SOFT_FLAG_KEYWORDS) {
    if (containsKeyword(lowercased, keyword)) {
      return {
        allowed: true,
        flagged: true,
        matched: keyword,
        reason: 'Flagged for manual review'
      };
    }
  }

  return { allowed: true, flagged: false };
}
