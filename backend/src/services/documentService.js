const fs = require('node:fs');
const crypto = require('node:crypto');
const documentRepository = require('../repositories/documentRepository');
const fileRepository = require('../repositories/fileRepository');

class DocumentServiceError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.name = 'DocumentServiceError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

function validateOwner(owner) {
  if (typeof owner !== 'string' || owner.trim() === '') {
    throw new DocumentServiceError(
      'O header X-User-Id é obrigatório.',
      400,
      'OWNER_REQUIRED',
    );
  }

  return owner.trim();
}

function createDocument(file, owner) {
  const documentOwner = validateOwner(owner);

  if (!file) {
    throw new DocumentServiceError(
      'O campo file é obrigatório.',
      400,
      'FILE_REQUIRED',
    );
  }

  const document = {
    id: crypto.randomUUID(),
    originalName: file.originalname,
    size: file.size,
    uploadedAt: new Date().toISOString(),
    owner: documentOwner,
    storageName: file.filename,
    mimeType: file.mimetype || 'application/octet-stream',
  };

  return documentRepository.save(document);
}

function listDocuments(owner) {
  return documentRepository.findByOwner(validateOwner(owner)).map(toPublicDocument);
}

function getDocumentForDownload(id, owner) {
  const documentOwner = validateOwner(owner);
  const document = documentRepository.findById(id);

  if (!document) {
    throw new DocumentServiceError(
      'Documento não encontrado.',
      404,
      'DOCUMENT_NOT_FOUND',
    );
  }

  if (document.owner !== documentOwner) {
    throw new DocumentServiceError(
      'O usuário não tem acesso a este documento.',
      403,
      'DOCUMENT_FORBIDDEN',
    );
  }

  const filePath = fileRepository.getFilePath(document.storageName);

  if (!fs.existsSync(filePath)) {
    throw new DocumentServiceError(
      'Arquivo do documento não encontrado.',
      404,
      'FILE_NOT_FOUND',
    );
  }

  return { document, filePath };
}

function toPublicDocument(document) {
  const { storageName, mimeType, ...publicDocument } = document;
  return publicDocument;
}

module.exports = {
  createDocument,
  listDocuments,
  getDocumentForDownload,
  toPublicDocument,
};