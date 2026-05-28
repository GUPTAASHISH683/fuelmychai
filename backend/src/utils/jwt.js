import jwt from 'jsonwebtoken';

const cookieName = 'chai_token';
const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

function getJwtSecret() {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }

  return process.env.JWT_SECRET;
}

export function signAuthToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      username: user.username || null
    },
    getJwtSecret(),
    {
      expiresIn: '7d'
    }
  );
}

export function verifyAuthToken(token) {
  return jwt.verify(token, getJwtSecret());
}

export function setAuthCookie(res, token) {
  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    maxAge: sevenDaysMs
  });
}

export function clearAuthCookie(res) {
  res.clearCookie(cookieName, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none'
  });
}

export { cookieName };
