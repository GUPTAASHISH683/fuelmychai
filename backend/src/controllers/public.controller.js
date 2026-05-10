import { query } from '../db/pool.js';
import { decryptValue } from '../utils/encryption.js';
import { httpError } from '../utils/httpError.js';

export async function getPublicCreator(req, res, next) {
  try {
    const username = String(req.params.username || '').toLowerCase();

    const result = await query(
      `SELECT name, username, bio, profile_image, upi_id, chai_amounts
       FROM users
       WHERE username = $1`,
      [username]
    );

    if (result.rowCount === 0) {
      throw httpError(404, "This chai page doesn't exist");
    }

    query(
      `UPDATE users
       SET visit_count = visit_count + 1
       WHERE username = $1`,
      [username]
    ).catch((error) => {
      console.error('Failed to increment visit count:', error.message);
    });

    res.status(200).json({
      creator: {
        ...result.rows[0],
        upi_id: decryptValue(result.rows[0].upi_id)
      }
    });
  } catch (error) {
    next(error);
  }
}
