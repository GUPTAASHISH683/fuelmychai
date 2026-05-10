import crypto from 'node:crypto';

const algorithm = 'aes-256-gcm';
const encryptedPrefix = 'enc:v1:';

function getEncryptionKey() {
  const secret = process.env.DATA_ENCRYPTION_KEY || process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('DATA_ENCRYPTION_KEY or JWT_SECRET is required for encryption');
  }

  return crypto.createHash('sha256').update(secret).digest();
}

export function encryptValue(value) {
  if (value === null || value === undefined || value === '') {
    return value || null;
  }

  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(algorithm, getEncryptionKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(String(value), 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return `${encryptedPrefix}${Buffer.concat([iv, authTag, ciphertext]).toString('base64url')}`;
}

export function decryptValue(value) {
  if (!value || typeof value !== 'string' || !value.startsWith(encryptedPrefix)) {
    return value || null;
  }

  const payload = Buffer.from(value.slice(encryptedPrefix.length), 'base64url');
  const iv = payload.subarray(0, 12);
  const authTag = payload.subarray(12, 28);
  const ciphertext = payload.subarray(28);
  const decipher = crypto.createDecipheriv(algorithm, getEncryptionKey(), iv);

  decipher.setAuthTag(authTag);

  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');
}

export function hashLookupValue(value) {
  if (!value) {
    return null;
  }

  const secret = process.env.DATA_ENCRYPTION_KEY || process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('DATA_ENCRYPTION_KEY or JWT_SECRET is required for hashing');
  }

  return crypto.createHmac('sha256', secret).update(String(value).toLowerCase().trim()).digest('hex');
}

export function decryptUserSensitiveFields(user) {
  if (!user) {
    return user;
  }

  return {
    ...user,
    email: decryptValue(user.email),
    upi_id: decryptValue(user.upi_id)
  };
}
