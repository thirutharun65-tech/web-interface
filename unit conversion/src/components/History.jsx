import { formatTimestamp } from "../utils/formatter";

export default function History({ history, onSelect, onClear }) {
  return (
    <div className="list-card">
      <div className="list-header">
        <h3>Recent Conversions</h3>
        {history.length > 0 && (
          <button type="button" className="clear-link" onClick={onClear}>
            Clear History
          </button>
        )}
      </div>
      {history.length === 0 ? (
        <p className="empty-note">No conversions yet. Try converting something above.</p>
      ) : (
        history.map((entry) => (
          <div className="history-row" key={entry.id}>
            <button type="button" onClick={() => onSelect(entry)}>
              {entry.summary}
            </button>
            <span className="history-time">{formatTimestamp(entry.timestamp)}</span>
          </div>
        ))
      )}
    </div>
  );
}
