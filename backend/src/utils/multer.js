const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const storage = multer.diskStorage(
  {
    destination: (req, file, cb) => {
      cb(null, './static/images');
    },
    filename: (req, file, cb) => {
      const randomString = crypto.randomBytes(50).toString('hex');
      cb(null, `${Date.now()}${randomString}${path.extname(file.originalname)}`);
    }
  }
);

const fileFilter = (req, file, cb) => {
  const acceptedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (acceptedMimeTypes.includes(file.mimetype)) {
    return cb(null, true);
  }
  cb(null, false);
};

const upload = multer({ storage, fileFilter });

module.exports = upload;