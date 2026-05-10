import { Router } from 'express';

import {
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
