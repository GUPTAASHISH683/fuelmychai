import { query } from '../db/pool.js';
import { decryptValue } from '../utils/encryption.js';
import { getIpHash } from '../utils/fingerprint.js';
import { httpError } from '../utils/httpError.js';
import { cookieName, verifyAuthToken } from '../utils/jwt.js';
import { getReferrerBucket } from '../utils/referrerBucket.js';

const validReportReasons = new Set([
  'fraud_campaign',
  'impersonation',
  'inappropriate_content',
  'spam',
  'minor',
  'harassment',
  'other'
]);

async function getOptionalReporter(req) {
  const token = req.cookies?.[cookieName];

  if (!token) {
    return null;
  }

  try {
    const payload = verifyAuthToken(token);
    const result = await query(
      `SELECT id, google_id, email, created_at
       FROM users
       WHERE id = $1`,
      [payload.userId]
    );

    if (result.rowCount === 0) {
      return null;
    }

    return {
      id: result.rows[0].id,
      googleId: result.rows[0].google_id,
      email: decryptValue(result.rows[0].email),
      createdAt: result.rows[0].created_at
    };
  } catch (error) {
    return null;
  }
}

function getReporterWeight(reporter) {
  if (!reporter) {
    return 0.5;
  }

  const accountAgeMs = Date.now() - new Date(reporter.createdAt).getTime();
  const twentyFourHoursMs = 24 * 60 * 60 * 1000;

  if (accountAgeMs < twentyFourHoursMs) {
    return 0.1;
  }

  return 1.0;
}

export async function getPublicCreator(req, res, next) {
  try {
    const username = String(req.params.username || '').toLowerCase();

    const result = await query(
      `SELECT id, name, username, bio, profile_image, upi_id, chai_amounts,
              social_links, availability_status, availability_label, thankyou_message, accent_color,
              page_live
       FROM users
       WHERE username = $1`,
      [username]
    );

    if (result.rowCount === 0) {
      throw httpError(404, "This chai page doesn't exist");
    }

    const creator = result.rows[0];
    const { id: creatorId, page_live: pageLive, ...publicCreator } = creator;

    if (pageLive === false) {
      res.status(200).json({
        success: true,
        creator: null,
        state: 'hidden',
        message: 'This page is currently hidden by the creator.'
      });
      return;
    }

    const ipHash = getIpHash(req);
    const referrerBucket = getReferrerBucket(
      req.headers.referer || '',
      req.query.utm_source || ''
    );

    query(
      `UPDATE users
       SET visit_count = visit_count + 1,
           updated_at = NOW()
       WHERE id = $1`,
      [creatorId]
    ).catch((error) => {
      console.error('Failed to increment visit count:', error.message);
    });

    query(
      `INSERT INTO page_events (creator_id, event_type, referrer_bucket, ip_hash)
       VALUES ($1, 'visit', $2, $3)`,
      [creatorId, referrerBucket, ipHash]
    ).catch((error) => {
      console.error('Failed to log page event:', error.message);
    });

    res.status(200).json({
      success: true,
      creator: {
        ...publicCreator,
        upi_id: decryptValue(publicCreator.upi_id)
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function reportPublicCreator(req, res, next) {
  try {
    const reportedUsername = String(req.body?.reported_username || '').toLowerCase().trim();
    const reason = String(req.body?.reason || '').trim();
    const details = String(req.body?.details || '').trim();
    const reporterEmailInput = String(req.body?.reporter_email || '').trim();

    if (!reportedUsername) {
      throw httpError(400, 'Reported username is required.');
    }

    if (!validReportReasons.has(reason)) {
      throw httpError(400, 'Invalid report reason.');
    }

    if (details.length > 500) {
      throw httpError(400, 'Report details must be 500 characters or fewer.');
    }

    if (reporterEmailInput.length > 100) {
      throw httpError(400, 'Reporter email must be 100 characters or fewer.');
    }

    const creatorResult = await query(
      `SELECT id, username
       FROM users
       WHERE username = $1`,
      [reportedUsername]
    );

    if (creatorResult.rowCount === 0) {
      throw httpError(404, 'Page not found.');
    }

    const creator = creatorResult.rows[0];
    const reporter = await getOptionalReporter(req);

    if (reporter?.googleId) {
      const duplicateReport = await query(
        `SELECT id
         FROM user_reports
         WHERE reported_username = $1
         AND reporter_google_id = $2
         LIMIT 1`,
        [creator.username, reporter.googleId]
      );

      if (duplicateReport.rowCount > 0) {
        res.status(200).json({
          success: true,
          message: 'Thank you. We will review this page.'
        });
        return;
      }
    }

    const reporterWeight = getReporterWeight(reporter);
    const reporterEmail = reporter?.email || reporterEmailInput || null;

    await query(
      `INSERT INTO user_reports (
         reported_username,
         reporter_email,
         reporter_google_id,
         reason,
         details,
         reporter_weight
       )
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        creator.username,
        reporterEmail,
        reporter?.googleId || null,
        reason,
        details || null,
        reporterWeight
      ]
    );

    const escalationResult = await query(
      `SELECT COALESCE(SUM(reporter_weight), 0) AS total_weight
       FROM user_reports
       WHERE reported_username = $1
       AND status = 'open'
       AND created_at > NOW() - INTERVAL '24 hours'`,
      [creator.username]
    );

    const totalWeight = Number(escalationResult.rows[0]?.total_weight || 0);

    if (totalWeight >= 5.0) {
      await query(
        `INSERT INTO review_queue (user_id, content_type, content, reason)
         VALUES ($1, $2, $3, $4)`,
        [
          creator.id,
          'report',
          `Auto-escalated: weighted report score ${totalWeight}`,
          'Multiple reports received'
        ]
      );
    }

    res.status(200).json({
      success: true,
      message: 'Thank you. We will review this page.'
    });
  } catch (error) {
    next(error);
  }
}
