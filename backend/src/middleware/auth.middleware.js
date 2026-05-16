import { query } from '../db/pool.js';
import { decryptValue } from '../utils/encryption.js';
import { httpError } from '../utils/httpError.js';
import { cookieName, verifyAuthToken } from '../utils/jwt.js';

export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.[cookieName];

    if (!token) {
      throw httpError(401, 'Unauthorized');
    }

    const payload = verifyAuthToken(token);
    const result = await query(
      `SELECT id, email, name, username, age_confirmed, page_live
       FROM users
       WHERE id = $1`,
      [payload.userId]
    );

    if (result.rowCount === 0) {
      throw httpError(401, 'Unauthorized');
    }

    req.user = {
      id: result.rows[0].id,
      email: decryptValue(result.rows[0].email),
      name: result.rows[0].name,
      username: result.rows[0].username,
      age_confirmed: Boolean(result.rows[0].age_confirmed),
      page_live: result.rows[0].page_live !== false
    };

    next();
  } catch (error) {
    if (error.statusCode) {
      next(error);
      return;
    }

    next(httpError(401, 'Unauthorized'));
  }
}
