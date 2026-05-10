import { Router } from 'express';

import {
  getCurrentUser,
  handleGoogleCallback,
  logout,
  redirectToGoogle
} from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/google', redirectToGoogle);
router.get('/google/callback', handleGoogleCallback);
router.get('/me', requireAuth, getCurrentUser);
router.get('/logout', logout);

export default router;
