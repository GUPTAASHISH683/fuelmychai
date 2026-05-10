import { query } from '../db/pool.js';
import { httpError } from '../utils/httpError.js';
import { deleteAvatarByUrl, uploadAvatar } from '../utils/cloudinary.js';
import { decryptUserSensitiveFields, encryptValue } from '../utils/encryption.js';
import { setAuthCookie, signAuthToken } from '../utils/jwt.js';

const usernameRegex = /^[a-z0-9_-]{3,30}$/;
const reservedUsernames = new Set([
  'admin',
  'support',
  'official',
  'help',
  'chai',
  'buymeachai',
  'fuelmychai',
  'api',
  'login',
  'logout',
  'dashboard',
  'settings',
  'username'
]);

export function isReservedUsername(username) {
  return reservedUsernames.has(username);
}

export async function setUsername(req, res, next) {
  try {
    const username = String(req.body?.username || '').trim();

    if (!usernameRegex.test(username)) {
      throw httpError(
        400,
        'Username must be 3-30 characters and use lowercase letters, numbers, hyphens, or underscores only'
      );
    }

    if (isReservedUsername(username)) {
      throw httpError(400, 'This username is reserved');
    }

    const currentUser = await query(
      `SELECT id, username
       FROM users
       WHERE id = $1`,
      [req.user.id]
    );

    if (currentUser.rowCount === 0) {
      throw httpError(401, 'Unauthorized');
    }

    if (currentUser.rows[0].username) {
      throw httpError(400, 'Username is already set');
    }

    const existingUsername = await query(
      `SELECT id
       FROM users
       WHERE username = $1`,
      [username]
    );

    if (existingUsername.rowCount > 0) {
      throw httpError(400, 'This username is already taken');
    }

    const updatedUser = await query(
      `UPDATE users
       SET username = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING id, email, name, username`,
      [username, req.user.id]
    );

    const user = updatedUser.rows[0];
    const token = signAuthToken(user);
    setAuthCookie(res, token);

    res.status(200).json({
      user: decryptUserSensitiveFields(user)
    });
  } catch (error) {
    next(error);
  }
}

function normalizeChaiAmounts(chaiAmounts) {
  if (!Array.isArray(chaiAmounts)) {
    throw httpError(400, 'Chai amounts must be a list');
  }

  return chaiAmounts.map((amount) => {
    const numericAmount = Number(amount);

    if (!Number.isInteger(numericAmount) || numericAmount < 1 || numericAmount > 10000) {
      throw httpError(400, 'Chai amounts must be whole numbers between 1 and 10000');
    }

    return numericAmount;
  });
}

export async function getMe(req, res, next) {
  try {
    const result = await query(
      `SELECT id, email, name, username, bio, upi_id, profile_image, chai_amounts, visit_count
       FROM users
       WHERE id = $1`,
      [req.user.id]
    );

    if (result.rowCount === 0) {
      throw httpError(401, 'Unauthorized');
    }

    res.status(200).json({
      user: decryptUserSensitiveFields(result.rows[0])
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const fields = [];
    const values = [];

    if (Object.hasOwn(req.body, 'name')) {
      const name = String(req.body.name || '').trim();

      if (!name || name.length > 50) {
        throw httpError(400, 'Display name is required and must be 50 characters or fewer');
      }

      values.push(name);
      fields.push(`name = $${values.length}`);
    }

    if (Object.hasOwn(req.body, 'bio')) {
      const bio = String(req.body.bio || '').trim();

      if (bio.length > 200) {
        throw httpError(400, 'Bio must be 200 characters or fewer');
      }

      values.push(bio || null);
      fields.push(`bio = $${values.length}`);
    }

    if (Object.hasOwn(req.body, 'upi_id')) {
      const upiId = String(req.body.upi_id || '').trim();

      if (!upiId || upiId.length > 100 || !upiId.includes('@')) {
        throw httpError(400, 'UPI ID is required and must contain @');
      }

      values.push(encryptValue(upiId));
      fields.push(`upi_id = $${values.length}`);
    }

    if (Object.hasOwn(req.body, 'chai_amounts')) {
      const chaiAmounts = normalizeChaiAmounts(req.body.chai_amounts);

      values.push(chaiAmounts);
      fields.push(`chai_amounts = $${values.length}::integer[]`);
    }

    if (fields.length === 0) {
      throw httpError(400, 'No profile fields were provided');
    }

    values.push(req.user.id);

    const result = await query(
      `UPDATE users
       SET ${fields.join(', ')},
           updated_at = NOW()
       WHERE id = $${values.length}
       RETURNING id, email, name, username, bio, upi_id, profile_image, chai_amounts, visit_count`,
      values
    );

    if (result.rowCount === 0) {
      throw httpError(401, 'Unauthorized');
    }

    res.status(200).json({
      user: decryptUserSensitiveFields(result.rows[0])
    });
  } catch (error) {
    next(error);
  }
}

export async function uploadAvatarImage(req, res, next) {
  try {
    if (!req.file) {
      throw httpError(400, 'Profile image is required');
    }

    const currentUser = await query(
      `SELECT profile_image
       FROM users
       WHERE id = $1`,
      [req.user.id]
    );

    if (currentUser.rowCount === 0) {
      throw httpError(401, 'Unauthorized');
    }

    const uploadResult = await uploadAvatar(req.file.buffer, req.user.id);

    const updatedUser = await query(
      `UPDATE users
       SET profile_image = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING id, email, name, username, bio, upi_id, profile_image, chai_amounts, visit_count`,
      [uploadResult.secure_url, req.user.id]
    );

    deleteAvatarByUrl(currentUser.rows[0].profile_image).catch((error) => {
      console.error('Failed to delete old avatar:', error.message);
    });

    res.status(200).json({
      user: decryptUserSensitiveFields(updatedUser.rows[0])
    });
  } catch (error) {
    next(error);
  }
}
