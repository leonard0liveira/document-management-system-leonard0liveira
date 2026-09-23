import { useCallback, useEffect, useState } from 'react';
import DocumentList from './components/DocumentList.jsx';
import UploadComponent from './components/UploadComponent.jsx';
import { listDocuments } from './services/documentApi.js';
import './styles.css';

export default function App() {
  const [userId, setUserId] = useState(
    () => window.localStorage.getItem('dms-user-id') || 'demo-user',
  );
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const loadDocuments = useCallback(async () => {
    const normalizedUserId = userId.trim();

    if (!normalizedUserId) {
      setDocuments([]);
      setError('Informe um identificador de usuário.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await listDocuments(normalizedUserId);
      setDocuments(result);
      window.localStorage.setItem('dms-user-id', normalizedUserId);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  function handleUserIdChange(event) {
    setUserId(event.target.value);
  }

  function handleUploadComplete(document) {
    setDocuments((currentDocuments) => [document, ...currentDocuments]);
    setError('');
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Arquivo local</p>
          <h1>Document Management System</h1>
          <p className="subtitle">
            Envie, consulte e baixe seus documentos em um único lugar.
          </p>
        </div>
        <div className="user-field">
          <label htmlFor="user-id">Usuário</label>
          <input
            id="user-id"
            value={userId}
            onChange={handleUserIdChange}
            placeholder="seu-identificador"
          />
        </div>
      </header>

      {error && <p className="alert alert-error">{error}</p>}

      <section className="workspace-grid">
        <UploadComponent
          userId={userId}
          onUploadComplete={handleUploadComplete}
        />
        <DocumentList
          documents={documents}
          userId={userId}
          isLoading={isLoading}
          onRefresh={loadDocuments}
        />
      </section>
    </main>
  );
}
