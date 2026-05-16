import { query } from '../db/pool.js';
import { httpError } from '../utils/httpError.js';
import { deleteAvatarByUrl, uploadAvatar } from '../utils/cloudinary.js';
import { screenContent } from '../utils/contentScreen.js';
import { decryptUserSensitiveFields, encryptValue } from '../utils/encryption.js';
import { checkImpersonationRisk } from '../utils/impersonationCheck.js';
import { setAuthCookie, signAuthToken } from '../utils/jwt.js';
import { analyseUpiId } from '../utils/upiValidator.js';
import { isUsernameAllowed } from '../utils/usernameGuard.js';

const usernameRegex = /^[a-z0-9_-]{3,30}$/;
const allowedSocialPlatforms = new Set(['youtube', 'instagram', 'twitter', 'linkedin', 'website']);
const allowedAvailabilityStatuses = new Set(['not_set', 'available', 'busy', 'custom']);
const allowedAccentColors = new Set(['amber', 'rose', 'violet', 'emerald', 'sky', 'orange', 'teal', 'pink']);
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

    const usernameGuard = isUsernameAllowed(username);
    if (!usernameGuard.allowed) {
      throw httpError(400, 'This username is not available.');
    }

    const impersonation = await checkImpersonationRisk(username);
    if (impersonation.risky) {
      throw httpError(400, 'This username is not available.');
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
       RETURNING id, email, name, username, age_confirmed, page_live`,
      [username, req.user.id]
    );

    const user = updatedUser.rows[0];
    const token = signAuthToken(user);
    setAuthCookie(res, token);

    res.status(200).json({
      success: true,
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

function normalizeSocialLinks(socialLinks) {
  if (!Array.isArray(socialLinks)) {
    throw httpError(400, 'Social links must be a list');
  }

  if (socialLinks.length > 5) {
    throw httpError(400, 'Maximum 5 social links are allowed');
  }

  return socialLinks.map((link) => {
    const platform = String(link?.platform || '').trim().toLowerCase();
    const url = String(link?.url || '').trim();

    if (!allowedSocialPlatforms.has(platform)) {
      throw httpError(400, 'Invalid social platform');
    }

    if (!url.startsWith('https://') || url.length > 200) {
      throw httpError(400, 'Social link URLs must start with https:// and be 200 characters or fewer');
    }

    return { platform, url };
  });
}

async function addReviewQueueItem(userId, contentType, content, reason, matchedWord) {
  await query(
    `INSERT INTO review_queue (user_id, content_type, content, reason, matched_word)
     VALUES ($1, $2, $3, $4, $5)`,
    [userId, contentType, content, reason, matchedWord || null]
  );
}

export async function getMe(req, res, next) {
  try {
    const result = await query(
      `SELECT id, email, name, username, bio, upi_id, profile_image, chai_amounts, visit_count,
              social_links, availability_status, availability_label, thankyou_message, accent_color,
              age_confirmed, page_live
       FROM users
       WHERE id = $1`,
      [req.user.id]
    );

    if (result.rowCount === 0) {
      throw httpError(401, 'Unauthorized');
    }

    res.status(200).json({
      success: true,
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

      const nameCheck = screenContent(name);
      if (!nameCheck.allowed) {
        throw httpError(400, 'Your display name contains content that is not permitted on this platform.');
      }

      if (nameCheck.flagged) {
        await addReviewQueueItem(req.user.id, 'display_name', name, nameCheck.reason, nameCheck.matched);
      }

      values.push(name);
      fields.push(`name = $${values.length}`);
    }

    if (Object.hasOwn(req.body, 'bio')) {
      const bio = String(req.body.bio || '').trim();

      if (bio.length > 200) {
        throw httpError(400, 'Bio must be 200 characters or fewer');
      }

      if (bio.length > 0) {
        const bioCheck = screenContent(bio);
        if (!bioCheck.allowed) {
          throw httpError(
            400,
            'Your bio contains content that is not permitted on this platform. Fuel My Chai is a creator support platform, not a fundraising or donation site.'
          );
        }

        if (bioCheck.flagged) {
          await addReviewQueueItem(req.user.id, 'bio', bio, bioCheck.reason, bioCheck.matched);
        }
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

    if (Object.hasOwn(req.body, 'social_links')) {
      const socialLinks = normalizeSocialLinks(req.body.social_links);

      values.push(JSON.stringify(socialLinks));
      fields.push(`social_links = $${values.length}::jsonb`);
    }

    if (Object.hasOwn(req.body, 'availability_status')) {
      const availabilityStatus = String(req.body.availability_status || '').trim();

      if (!allowedAvailabilityStatuses.has(availabilityStatus)) {
        throw httpError(400, 'Invalid availability status');
      }

      values.push(availabilityStatus);
      fields.push(`availability_status = $${values.length}`);
    }

    if (Object.hasOwn(req.body, 'availability_label')) {
      const availabilityLabel = String(req.body.availability_label || '').trim();

      if (availabilityLabel.length > 50) {
        throw httpError(400, 'Availability label must be 50 characters or fewer');
      }

      if (availabilityLabel.length > 0) {
        const availabilityCheck = screenContent(availabilityLabel);
        if (!availabilityCheck.allowed || availabilityCheck.flagged) {
          throw httpError(400, 'Your availability label contains content that is not permitted on this platform.');
        }
      }

      values.push(availabilityLabel || null);
      fields.push(`availability_label = $${values.length}`);
    }

    if (Object.hasOwn(req.body, 'thankyou_message')) {
      const thankyouMessage = String(req.body.thankyou_message || '').trim();

      if (thankyouMessage.length > 200) {
        throw httpError(400, 'Thank-you message must be 200 characters or fewer');
      }

      if (thankyouMessage.length > 0) {
        const thankyouCheck = screenContent(thankyouMessage);
        if (!thankyouCheck.allowed) {
          throw httpError(400, 'Your thank-you message contains content that is not permitted on this platform.');
        }
      }

      values.push(thankyouMessage || null);
      fields.push(`thankyou_message = $${values.length}`);
    }

    if (Object.hasOwn(req.body, 'accent_color')) {
      const accentColor = String(req.body.accent_color || '').trim();

      if (!allowedAccentColors.has(accentColor)) {
        throw httpError(400, 'Invalid accent color');
      }

      values.push(accentColor);
      fields.push(`accent_color = $${values.length}`);
    }

    if (Object.hasOwn(req.body, 'page_live')) {
      const pageLive = req.body.page_live === true;

      values.push(pageLive);
      fields.push(`page_live = $${values.length}`);
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
       RETURNING id, email, name, username, bio, upi_id, profile_image, chai_amounts, visit_count,
                 social_links, availability_status, availability_label, thankyou_message, accent_color,
                 age_confirmed, page_live`,
      values
    );

    if (result.rowCount === 0) {
      throw httpError(401, 'Unauthorized');
    }

    res.status(200).json({
      success: true,
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
       RETURNING id, email, name, username, bio, upi_id, profile_image, chai_amounts, visit_count,
                 social_links, availability_status, availability_label, thankyou_message, accent_color,
                 age_confirmed, page_live`,
      [uploadResult.secure_url, req.user.id]
    );

    deleteAvatarByUrl(currentUser.rows[0].profile_image).catch((error) => {
      console.error('Failed to delete old avatar:', error.message);
    });

    res.status(200).json({
      success: true,
      user: decryptUserSensitiveFields(updatedUser.rows[0])
    });
  } catch (error) {
    next(error);
  }
}

export async function checkUpiPrivacy(req, res, next) {
  try {
    const analysis = analyseUpiId(req.query?.upi_id);

    res.status(200).json({
      success: true,
      isPhoneNumber: Boolean(analysis.isPhoneNumber),
      privacyRisk: analysis.privacyRisk || 'low'
    });
  } catch (error) {
    next(error);
  }
}

export async function getAnalytics(req, res, next) {
  try {
    const userResult = await query(
      `SELECT visit_count
       FROM users
       WHERE id = $1`,
      [req.user.id]
    );

    if (userResult.rowCount === 0) {
      throw httpError(401, 'Unauthorized');
    }

    const referrersResult = await query(
      `SELECT referrer_bucket, COUNT(*)::int AS count
       FROM page_events
       WHERE creator_id = $1
       AND event_type = 'visit'
       AND created_at > NOW() - INTERVAL '30 days'
       GROUP BY referrer_bucket
       ORDER BY count DESC`,
      [req.user.id]
    );

    const dailyResult = await query(
      `SELECT DATE(created_at) AS date, COUNT(*)::int AS count
       FROM page_events
       WHERE creator_id = $1
       AND event_type = 'visit'
       AND created_at > NOW() - INTERVAL '14 days'
       GROUP BY DATE(created_at)
       ORDER BY date ASC`,
      [req.user.id]
    );

    res.status(200).json({
      success: true,
      analytics: {
        total_visits: Number(userResult.rows[0].visit_count || 0),
        referrers: referrersResult.rows.map((row) => ({
          bucket: row.referrer_bucket,
          count: Number(row.count || 0)
        })),
        daily: dailyResult.rows.map((row) => ({
          date: row.date instanceof Date ? row.date.toISOString().slice(0, 10) : String(row.date),
          count: Number(row.count || 0)
        }))
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function confirmAge(req, res, next) {
  try {
    const result = await query(
      `UPDATE users
       SET age_confirmed = true,
           updated_at = NOW()
       WHERE id = $1
       RETURNING id`,
      [req.user.id]
    );

    if (result.rowCount === 0) {
      throw httpError(401, 'Unauthorized');
    }

    res.status(200).json({
      success: true
    });
  } catch (error) {
    next(error);
  }
}
