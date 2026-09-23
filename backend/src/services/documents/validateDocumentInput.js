function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function validateDocumentCreationInput({ file, ownerId = null }) {
  if (!file || typeof file !== 'object') {
    throw new TypeError('O arquivo do documento é obrigatório.');
  }

  if (!isNonEmptyString(file.originalname)) {
    throw new TypeError('O nome original do documento é obrigatório.');
  }

  if (!isNonEmptyString(file.path)) {
    throw new TypeError('O caminho do arquivo do documento é obrigatório.');
  }

  if (!Number.isFinite(file.size) || file.size < 0) {
    throw new TypeError('O tamanho do documento deve ser um número maior ou igual a zero.');
  }

  if (ownerId !== null && ownerId !== undefined && !isNonEmptyString(ownerId)) {
    throw new TypeError('O identificador do usuário deve ser uma string não vazia quando informado.');
  }
}

function validateDocumentId(documentId) {
  if (!isNonEmptyString(documentId)) {
    throw new TypeError('O identificador do documento é obrigatório.');
  }
}

module.exports = {
  validateDocumentCreationInput,
  validateDocumentId
};
