import { Router } from 'express';

import {
  checkUpiPrivacy,
  confirmAge,
  getAnalytics,
  getMe,
  setUsername,
  updateProfile,
  uploadAvatarImage
} from '../controllers/user.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { avatarLimiter, usernameLimiter } from '../middleware/rateLimit.middleware.js';
import { avatarUpload, handleUploadError } from '../middleware/upload.middleware.js';

const router = Router();

router.get('/me', requireAuth, getMe);
router.get('/analytics', requireAuth, getAnalytics);
router.get('/upi-check', requireAuth, checkUpiPrivacy);
router.post('/confirm-age', requireAuth, confirmAge);
router.patch('/profile', requireAuth, updateProfile);
router.post(
  '/avatar',
  avatarLimiter,
  requireAuth,
  avatarUpload.single('avatar'),
  handleUploadError,
  uploadAvatarImage
);
router.post('/username', usernameLimiter, requireAuth, setUsername);

export default router;
