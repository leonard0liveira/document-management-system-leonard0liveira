const { test } = require('node:test');
const assert = require('node:assert');
const {
  createDocumentService
} = require('../../../src/services/documents/documentService');

function createRepositoryDouble(initialDocuments = []) {
  const documents = [...initialDocuments];

  return {
    save(documentMetadata) {
      documents.push(documentMetadata);
      return documentMetadata;
    },
    list() {
      return [...documents];
    },
    findById(documentId) {
      return documents.find((document) => document.id === documentId) ?? null;
    }
  };
}

test('createDocument salva metadados centralizados pelo serviço', () => {
  const service = createDocumentService({
    documentRepository: createRepositoryDouble(),
    generateId: () => 'doc-001',
    getCurrentTimestamp: () => '2026-09-23T14:00:00.000Z'
  });

  const createdDocument = service.createDocument({
    ownerId: 'user-1',
    file: {
      originalname: 'manual.pdf',
      path: 'storage/manual.pdf',
      size: 4096,
      mimetype: 'application/pdf'
    }
  });

  assert.deepStrictEqual(createdDocument, {
    id: 'doc-001',
    originalName: 'manual.pdf',
    storagePath: 'storage/manual.pdf',
    size: 4096,
    mimeType: 'application/pdf',
    ownerId: 'user-1',
    uploadedAt: '2026-09-23T14:00:00.000Z'
  });
});

test('createDocument rejeita arquivo inválido antes de persistir', () => {
  let saved = false;
  const service = createDocumentService({
    documentRepository: {
      save() {
        saved = true;
      },
      list() {
        return [];
      },
      findById() {
        return null;
      }
    }
  });

  assert.throws(
    () => service.createDocument({ file: { originalname: '', path: 'storage/a.txt', size: 10 } }),
    /O nome original do documento é obrigatório\./
  );
  assert.strictEqual(saved, false);
});

test('listDocuments delega a listagem para o repositório', () => {
  const existingDocuments = [
    { id: 'doc-1', originalName: 'a.pdf' },
    { id: 'doc-2', originalName: 'b.pdf' }
  ];
  const service = createDocumentService({
    documentRepository: createRepositoryDouble(existingDocuments)
  });

  assert.deepStrictEqual(service.listDocuments(), existingDocuments);
});

test('getDocumentById valida o identificador e retorna o documento encontrado', () => {
  const existingDocument = { id: 'doc-9', originalName: 'relatorio.pdf' };
  const service = createDocumentService({
    documentRepository: createRepositoryDouble([existingDocument])
  });

  assert.deepStrictEqual(service.getDocumentById('doc-9'), existingDocument);
  assert.throws(() => service.getDocumentById(''), /O identificador do documento é obrigatório\./);
});
