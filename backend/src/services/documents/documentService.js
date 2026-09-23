const { randomUUID } = require('node:crypto');
const { buildDocumentMetadata } = require('./buildDocumentMetadata');
const {
  validateDocumentCreationInput,
  validateDocumentId
} = require('./validateDocumentInput');

function createDocumentService({
  documentRepository,
  buildMetadata = buildDocumentMetadata,
  validateCreationInput = validateDocumentCreationInput,
  validateId = validateDocumentId,
  generateId = randomUUID,
  getCurrentTimestamp = () => new Date().toISOString()
}) {
  if (!documentRepository || typeof documentRepository !== 'object') {
    throw new TypeError('O repositório de documentos é obrigatório.');
  }

  if (typeof documentRepository.save !== 'function') {
    throw new TypeError('O repositório de documentos deve implementar save.');
  }

  if (typeof documentRepository.list !== 'function') {
    throw new TypeError('O repositório de documentos deve implementar list.');
  }

  if (typeof documentRepository.findById !== 'function') {
    throw new TypeError('O repositório de documentos deve implementar findById.');
  }

  function createDocument({ file, ownerId }) {
    validateCreationInput({ file, ownerId });

    const documentMetadata = buildMetadata({
      id: generateId(),
      uploadedAt: getCurrentTimestamp(),
      file,
      ownerId: ownerId ?? null
    });

    return documentRepository.save(documentMetadata);
  }

  function listDocuments() {
    return documentRepository.list();
  }

  function getDocumentById(documentId) {
    validateId(documentId);

    return documentRepository.findById(documentId);
  }

  return {
    createDocument,
    listDocuments,
    getDocumentById
  };
}

module.exports = { createDocumentService };
