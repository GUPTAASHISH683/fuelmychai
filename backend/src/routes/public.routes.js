import { Router } from 'express';

import { getPublicCreator, reportPublicCreator } from '../controllers/public.controller.js';

const router = Router();

router.post('/report', reportPublicCreator);
router.get('/:username', getPublicCreator);

export default router;
