import { Router } from 'express';

import { getPublicCreator } from '../controllers/public.controller.js';

const router = Router();

router.get('/:username', getPublicCreator);

export default router;
