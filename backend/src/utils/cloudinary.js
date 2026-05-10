import { v2 as cloudinary } from 'cloudinary';

import { httpError } from './httpError.js';

let configured = false;

function configureCloudinary() {
  if (configured) {
    return;
  }

  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw httpError(500, 'Cloudinary is not configured');
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
  });

  configured = true;
}

export async function uploadAvatar(fileBuffer, userId) {
  configureCloudinary();

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'fuel-my-chai/avatars',
        public_id: `user-${userId}-${Date.now()}`,
        resource_type: 'image',
        overwrite: true
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      }
    );

    uploadStream.end(fileBuffer);
  });
}

export async function deleteAvatarByUrl(imageUrl) {
  if (!imageUrl) {
    return;
  }

  configureCloudinary();

  const publicId = getPublicIdFromCloudinaryUrl(imageUrl);

  if (!publicId) {
    return;
  }

  await cloudinary.uploader.destroy(publicId, {
    resource_type: 'image'
  });
}

function getPublicIdFromCloudinaryUrl(imageUrl) {
  try {
    const url = new URL(imageUrl);
    const uploadIndex = url.pathname.indexOf('/upload/');

    if (uploadIndex === -1) {
      return null;
    }

    const afterUpload = url.pathname.slice(uploadIndex + '/upload/'.length);
    const withoutVersion = afterUpload.replace(/^v\d+\//, '');
    const withoutExtension = withoutVersion.replace(/\.[^/.]+$/, '');

    return decodeURIComponent(withoutExtension);
  } catch (error) {
    return null;
  }
}
