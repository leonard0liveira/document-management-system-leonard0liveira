import DownloadButton from './DownloadButton.jsx';

export default function DocumentList({
  documents,
  userId,
  isLoading,
  onRefresh,
}) {
  return (
    <section className="panel document-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Sua biblioteca</p>
          <h2>Documentos</h2>
        </div>
        <button
          className="icon-button"
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          title="Atualizar lista"
          aria-label="Atualizar lista"
        >
          ↻
        </button>
      </div>

      {isLoading && <p className="empty-state">Carregando documentos...</p>}
      {!isLoading && documents.length === 0 && (
        <p className="empty-state">Nenhum documento enviado ainda.</p>
      )}
      {!isLoading && documents.length > 0 && (
        <ul className="document-list">
          {documents.map((document) => (
            <li className="document-row" key={document.id}>
              <div className="document-info">
                <strong title={document.originalName}>{document.originalName}</strong>
                <span>
                  {formatFileSize(document.size)} · {formatDate(document.uploadedAt)}
                </span>
              </div>
              <DownloadButton document={document} userId={userId} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function formatFileSize(size) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(date) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date));
}