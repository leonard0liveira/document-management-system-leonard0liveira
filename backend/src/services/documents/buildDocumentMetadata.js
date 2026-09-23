function buildDocumentMetadata({ id, uploadedAt, file, ownerId = null }) {
  return {
    id,
    originalName: file.originalname,
    storagePath: file.path,
    size: file.size,
    mimeType: file.mimetype ?? null,
    ownerId,
    uploadedAt
  };
}

module.exports = { buildDocumentMetadata };
