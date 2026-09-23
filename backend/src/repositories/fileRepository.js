const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const multer = require('multer');

const storageDirectory = process.env.STORAGE_DIR
  ? path.resolve(process.env.STORAGE_DIR)
  : path.resolve(__dirname, '../../storage');

function ensureStorageDirectory() {
  fs.mkdirSync(storageDirectory, { recursive: true });
}

function createStorage() {
  ensureStorageDirectory();

  return multer.diskStorage({
    destination: (request, file, callback) => {
      callback(null, storageDirectory);
    },
    filename: (request, file, callback) => {
      const extension = path.extname(file.originalname).toLowerCase();
      callback(null, `${crypto.randomUUID()}${extension}`);
    },
  });
}

function getFilePath(filename) {
  const filePath = path.resolve(storageDirectory, filename);

  if (!filePath.startsWith(`${storageDirectory}${path.sep}`)) {
    throw new Error('Caminho de arquivo inválido.');
  }

  return filePath;
}

module.exports = {
  createStorage,
  getFilePath,
};