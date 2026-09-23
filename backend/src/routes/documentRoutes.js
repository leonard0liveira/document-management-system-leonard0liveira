const express = require('express');
const multer = require('multer');
const documentController = require('../controllers/documentController');
const fileRepository = require('../repositories/fileRepository');

const router = express.Router();
const maxFileSize = Number(process.env.MAX_FILE_SIZE || 10 * 1024 * 1024);
const allowedMimeTypes = new Set(
  (process.env.ALLOWED_MIME_TYPES || '')
    .split(',')
    .map((type) => type.trim())
    .filter(Boolean),
);

const upload = multer({
  storage: fileRepository.createStorage(),
  limits: { fileSize: maxFileSize },
  fileFilter: (request, file, callback) => {
    if (allowedMimeTypes.size > 0 && !allowedMimeTypes.has(file.mimetype)) {
      const error = new Error('O tipo do arquivo não é permitido.');
      error.code = 'INVALID_FILE_TYPE';
      return callback(error);
    }

    return callback(null, true);
  },
});

router.post('/upload', upload.single('file'), documentController.upload);
router.get('/documents', documentController.list);
router.get('/documents/:id/download', documentController.download);

module.exports = router;