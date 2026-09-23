const { test } = require('node:test');
const assert = require('node:assert');
const {
  validateDocumentCreationInput,
  validateDocumentId
} = require('../../../src/services/documents/validateDocumentInput');

test('validateDocumentCreationInput aceita um payload válido', () => {
  assert.doesNotThrow(() => {
    validateDocumentCreationInput({
      ownerId: 'user-10',
      file: {
        originalname: 'arquivo.pdf',
        path: 'storage/arquivo.pdf',
        size: 512
      }
    });
  });
});

test('validateDocumentCreationInput rejeita ownerId inválido', () => {
  assert.throws(
    () => validateDocumentCreationInput({
      ownerId: '   ',
      file: {
        originalname: 'arquivo.pdf',
        path: 'storage/arquivo.pdf',
        size: 512
      }
    }),
    /O identificador do usuário deve ser uma string não vazia quando informado\./
  );
});

test('validateDocumentId rejeita identificador vazio', () => {
  assert.throws(() => validateDocumentId(''), /O identificador do documento é obrigatório\./);
});
