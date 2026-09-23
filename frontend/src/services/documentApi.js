const API_PREFIX = '/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_PREFIX}${path}`, options);

  if (!response.ok) {
    let message = 'Não foi possível concluir a solicitação.';

    try {
      const payload = await response.json();
      message = payload.error || message;
    } catch {
      // A resposta pode não conter JSON em erros produzidos pelo servidor.
    }

    throw new Error(message);
  }

  return response;
}

function userHeaders(userId) {
  return { 'X-User-Id': userId.trim() };
}

export async function uploadDocument(file, userId) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await request('/upload', {
    method: 'POST',
    headers: userHeaders(userId),
    body: formData,
  });

  return response.json();
}

export async function listDocuments(userId) {
  const response = await request('/documents', {
    headers: userHeaders(userId),
  });

  return response.json();
}

export async function downloadDocument(documentId, userId) {
  const response = await request(`/documents/${documentId}/download`, {
    headers: userHeaders(userId),
  });

  return {
    blob: await response.blob(),
    fileName: getFileName(response.headers.get('Content-Disposition')),
  };
}

function getFileName(contentDisposition) {
  if (!contentDisposition) {
    return 'documento';
  }

  const encodedName = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (encodedName) {
    return decodeURIComponent(encodedName[1]);
  }

  const plainName = contentDisposition.match(/filename="?([^";]+)"?/i);
  return plainName ? plainName[1] : 'documento';
}