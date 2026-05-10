import rateLimit from 'express-rate-limit';

export const usernameLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: true,
    message: 'Too many attempts. Please try again in a minute.'
  }
});

export const avatarLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: true,
    message: 'Too many upload attempts. Please try again in a minute.'
  }
});
