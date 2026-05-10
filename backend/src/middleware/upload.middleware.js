import multer from 'multer';

import { httpError } from '../utils/httpError.js';

const allowedMimeTypes = new Set(['image/jpeg', 'image/png']);

export const avatarUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      cb(httpError(400, 'Profile image must be a JPG or PNG file'));
      return;
    }

    cb(null, true);
  }
});

export function handleUploadError(err, req, res, next) {
  if (!err) {
    next();
    return;
  }

  if (err.code === 'LIMIT_FILE_SIZE') {
    next(httpError(400, 'Profile image must be 1MB or smaller'));
    return;
  }

  next(err);
}
