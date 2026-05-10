import { query } from '../db/pool.js';
import {
  decryptUserSensitiveFields,
  encryptValue,
  hashLookupValue
} from '../utils/encryption.js';
import { clearAuthCookie, setAuthCookie, signAuthToken } from '../utils/jwt.js';
import { httpError } from '../utils/httpError.js';

function requireEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw httpError(500, `${name} is not configured`);
  }

  return value;
}

function getGoogleAuthUrl() {
  const params = new URLSearchParams({
    client_id: requireEnv('GOOGLE_CLIENT_ID'),
    redirect_uri: requireEnv('GOOGLE_REDIRECT_URI'),
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'select_account'
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

async function exchangeCodeForToken(code) {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      code,
      client_id: requireEnv('GOOGLE_CLIENT_ID'),
      client_secret: requireEnv('GOOGLE_CLIENT_SECRET'),
      redirect_uri: requireEnv('GOOGLE_REDIRECT_URI'),
      grant_type: 'authorization_code'
    })
  });

  if (!response.ok) {
    throw httpError(401, 'Google authentication failed');
  }

  return response.json();
}

async function fetchGoogleProfile(accessToken) {
  const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    throw httpError(401, 'Could not fetch Google profile');
  }

  return response.json();
}

async function findOrCreateUser(profile) {
  const emailHash = hashLookupValue(profile.email);
  const existingUser = await query(
    `SELECT id, email, name, username
     FROM users
     WHERE google_id = $1 OR email_hash = $2`,
    [profile.sub, emailHash]
  );

  if (existingUser.rowCount > 0) {
    return decryptUserSensitiveFields(existingUser.rows[0]);
  }

  const createdUser = await query(
    `INSERT INTO users (google_id, email, email_hash, name)
     VALUES ($1, $2, $3, $4)
     RETURNING id, email, name, username`,
    [profile.sub, encryptValue(profile.email), emailHash, (profile.name || profile.email).slice(0, 50)]
  );

  return decryptUserSensitiveFields(createdUser.rows[0]);
}

export async function redirectToGoogle(req, res, next) {
  try {
    res.redirect(getGoogleAuthUrl());
  } catch (error) {
    next(error);
  }
}

export async function handleGoogleCallback(req, res, next) {
  try {
    const { code } = req.query;

    if (!code) {
      throw httpError(400, 'Missing Google authorization code');
    }

    const tokenData = await exchangeCodeForToken(code);
    const profile = await fetchGoogleProfile(tokenData.access_token);

    if (!profile.sub || !profile.email) {
      throw httpError(401, 'Google profile is missing required information');
    }

    const user = await findOrCreateUser(profile);
    const token = signAuthToken(user);
    setAuthCookie(res, token);

    res.redirect(`${requireEnv('CLIENT_URL')}/dashboard`);
  } catch (error) {
    next(error);
  }
}

export async function getCurrentUser(req, res, next) {
  try {
    res.status(200).json({
      user: req.user
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(req, res, next) {
  try {
    clearAuthCookie(res);
    res.status(200).json({
      message: 'Logged out'
    });
  } catch (error) {
    next(error);
  }
}
