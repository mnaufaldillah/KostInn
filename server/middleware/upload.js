const multer = require('multer');

// ponytail: memory storage — buffer handed straight to Cloudinary, nothing written to disk
const ALLOWED = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];

const fileFilter = (req, file, cb) => {
    if (ALLOWED.includes(file.mimetype)) return cb(null, true);
    cb({ name: 'BadRequest', message: 'Only PNG, JPG, JPEG, or PDF files are allowed' });
};

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

module.exports = upload;
