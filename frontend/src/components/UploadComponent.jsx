import { useRef, useState } from 'react';
import { uploadDocument } from '../services/documentApi.js';

export default function UploadComponent({ userId, onUploadComplete }) {
  const inputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function handleFileChange(event) {
    setSelectedFile(event.target.files[0] || null);
    setMessage('');
    setError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!selectedFile) {
      setError('Selecione um arquivo para enviar.');
      return;
    }

    if (!userId.trim()) {
      setError('Informe um usuário antes de enviar o arquivo.');
      return;
    }

    setIsUploading(true);
    setMessage('');
    setError('');

    try {
      const document = await uploadDocument(selectedFile, userId);
      onUploadComplete(document);
      setSelectedFile(null);
      inputRef.current.value = '';
      setMessage('Documento enviado com sucesso.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <section className="panel upload-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Novo documento</p>
          <h2>Fazer upload</h2>
        </div>
        <span className="panel-mark">+</span>
      </div>
      <form onSubmit={handleSubmit}>
        <label className="file-dropzone" htmlFor="document-file">
          <span className="file-icon">↑</span>
          <strong>{selectedFile ? selectedFile.name : 'Escolha um arquivo'}</strong>
          <span>{selectedFile ? formatFileSize(selectedFile.size) : 'Qualquer formato permitido pelo servidor'}</span>
        </label>
        <input
          ref={inputRef}
          id="document-file"
          type="file"
          onChange={handleFileChange}
          className="visually-hidden"
        />
        <button className="primary-button" type="submit" disabled={isUploading}>
          {isUploading ? 'Enviando...' : 'Enviar documento'}
        </button>
      </form>
      {message && <p className="status-message">{message}</p>}
      {error && <p className="status-message error-text">{error}</p>}
    </section>
  );
}

function formatFileSize(size) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}