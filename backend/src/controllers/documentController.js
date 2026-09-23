const documentService = require('../services/documentService');

function upload(request, response, next) {
  try {
    const document = documentService.createDocument(
      request.file,
      request.get('X-User-Id'),
    );

    return response.status(201).json(documentService.toPublicDocument(document));
  } catch (error) {
    return next(error);
  }
}

function list(request, response, next) {
  try {
    const documents = documentService.listDocuments(request.get('X-User-Id'));
    return response.json(documents);
  } catch (error) {
    return next(error);
  }
}

function download(request, response, next) {
  try {
    const { document, filePath } = documentService.getDocumentForDownload(
      request.params.id,
      request.get('X-User-Id'),
    );

    response.type(document.mimeType);
    return response.download(filePath, document.originalName);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  upload,
  list,
  download,
};