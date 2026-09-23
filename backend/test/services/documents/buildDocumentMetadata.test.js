const { test } = require('node:test');
const assert = require('node:assert');
const {
  buildDocumentMetadata
} = require('../../../src/services/documents/buildDocumentMetadata');

test('buildDocumentMetadata cria os metadados esperados do documento', () => {
  const metadata = buildDocumentMetadata({
    id: 'doc-123',
    uploadedAt: '2026-09-23T12:00:00.000Z',
    ownerId: 'user-42',
    file: {
      originalname: 'contrato.pdf',
      path: 'storage/contrato.pdf',
      size: 2048,
      mimetype: 'application/pdf'
    }
  });

  assert.deepStrictEqual(metadata, {
    id: 'doc-123',
    originalName: 'contrato.pdf',
    storagePath: 'storage/contrato.pdf',
    size: 2048,
    mimeType: 'application/pdf',
    ownerId: 'user-42',
    uploadedAt: '2026-09-23T12:00:00.000Z'
  });
});

test('buildDocumentMetadata mantém ownerId nulo quando o dono não é informado', () => {
  const metadata = buildDocumentMetadata({
    id: 'doc-456',
    uploadedAt: '2026-09-23T12:30:00.000Z',
    file: {
      originalname: 'nota.txt',
      path: 'storage/nota.txt',
      size: 128
    }
  });

  assert.strictEqual(metadata.ownerId, null);
  assert.strictEqual(metadata.mimeType, null);
});
