export function normaliseUsername(username) {
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

export const BLOCKED_USERNAMES = [
  'fuck',
  'fucker',
  'fucking',
  'fucked',
  'fucks',
  'fck',
  'fuk',
  'shit',
  'shitty',
  'bullshit',
  'bitch',
  'bitches',
  'ass',
  'asshole',
  'jackass',
  'dumbass',
  'bastard',
  'cunt',
  'cunts',
  'dick',
  'dicks',
  'dickhead',
  'cock',
  'cocks',
  'cocksucker',
  'pussy',
  'whore',
  'slut',
  'sluts',
  'nigger',
  'nigga',
  'faggot',
  'fag',
  'retard',
  'rape',
  'rapist',
  'pedo',
  'pedophile',
  'porn',
  'porno',
  'xxx',
  'sexy',
  'nude',
  'nudes',
  'naked',
  'boobs',
  'tits',
  'penis',
  'vagina',
  'anus',
  'kill',
  'murder',
  'terrorist',
  'jihad',
  'hitler',
  'nazi',
  'madarchod',
  'maderchod',
  'maadarchod',
  'mc',
  'bhenchod',
  'benchod',
  'bc',
  'behen-chod',
  'chutiya',
  'chutiye',
  'chut',
  'chutiyapa',
  'randi',
  'randiya',
  'gaand',
  'gand',
  'gaandu',
  'gandu',
  'lund',
  'lauda',
  'lavde',
  'lavda',
  'loda',
  'bhosdike',
  'bhosdiwale',
  'bhosdi',
  'haramkhor',
  'harami',
  'kamina',
  'kamine',
  'bakchod',
  'bakchodi',
  'jhant',
  'jhatu',
  'dalla',
  'dalal',
  'gashti',
  'raand',
  'khanki',
  'suar',
  'suwar',
  'punda',
  'thevidiya',
  'ommala',
  'dengey',
  'puku',
  'modda',
  'phuddu',
  'lann',
  'khankir',
  'magi',
  'narendramodi',
  'rahulgandhi',
  'amitshah',
  'kejriwal',
  'pmoindia',
  'rbiofficial',
  'sebiofficial',
  'npcipay',
  'bjpofficial',
  'inccongress',
  'fuelmychai-sucks',
  'fuelmychai-scam',
  'fuelmychai-fraud',
  'fuelmychai-fake'
];

export function isUsernameAllowed(username) {
  const raw = String(username || '').toLowerCase();
  const normalised = normaliseUsername(raw);

  for (const word of BLOCKED_USERNAMES) {
    const blocked = word.toLowerCase();
    const normalisedBlocked = normaliseUsername(blocked);

    if (raw === blocked) {
      return { allowed: false, reason: 'exact_match', matched: word };
    }

    if (normalised === normalisedBlocked) {
      return { allowed: false, reason: 'normalised_match', matched: word };
    }

    if (raw.includes(blocked)) {
      return { allowed: false, reason: 'contains_raw', matched: word };
    }

    if (normalised.includes(normalisedBlocked)) {
      return { allowed: false, reason: 'contains_normalised', matched: word };
    }
  }

  return { allowed: true };
}
