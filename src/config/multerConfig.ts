import * as multer from 'multer';

import { PictureCategory } from '@fabiant1498/llovizna-blog';

type UploadDirUrls = Record<PictureCategory, string>;

let parentDir = 'assets';

export const uploadDirUrl: UploadDirUrls = {
  post: `${parentDir}/posts`,
  profile: `${parentDir}/profiles`,
  ad: `${parentDir}/ads`,
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const multerErrorCode: multer.ErrorCode = 'LIMIT_UNEXPECTED_FILE';
    const multerError = new multer.MulterError(multerErrorCode);

    if (!req.body.pictureCategory) {
      multerError.message = 'Picture category is required';
      return cb(multerError, '');
    }

    let pictureCategory: PictureCategory = req.body?.pictureCategory as PictureCategory;

    let uploadDir = uploadDirUrl[pictureCategory] || '';

    if (uploadDir === '') {
      multerError.message = 'Picture category is not valid';
      return cb(multerError, '');
    }

    // rid pictureCategory property from request, it's not needed anymore
    delete req.body.pictureCategory;

    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileExtension = file.originalname.split('.').pop();
    const fileName = uniqueSuffix + '.' + fileExtension;
    cb(null, fileName);
  },
});

export const upload = multer({ storage });
