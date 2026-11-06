const PRECISION_OPTIONS = [0, 1, 2, 3, 4, 6, 8];

export default function ResultDisplay({
  equationText,
  resultText,
  precision,
  onPrecisionChange,
  onCopy,
  onToggleFavorite,
  isFavorite,
  disabled,
}) {
  return (
    <div className="result-block">
      <p className="section-eyebrow" style={{ marginBottom: 6 }}>
        Result
      </p>
      <div className="result-value" aria-live="polite">
        {resultText}
      </div>
      {equationText && <p className="result-equation">{equationText}</p>}

      <div className="precision-row">
        <label htmlFor="precision-select">Decimal places:</label>
        <select
          id="precision-select"
          value={precision}
          onChange={(e) => onPrecisionChange(Number(e.target.value))}
        >
          {PRECISION_OPTIONS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div className="result-actions">
        <button type="button" className="pill-button primary" onClick={onCopy} disabled={disabled}>
          <span aria-hidden="true">📋</span> Copy Result
        </button>
        <button
          type="button"
          className={`pill-button${isFavorite ? " starred" : ""}`}
          onClick={onToggleFavorite}
          aria-pressed={isFavorite}
        >
          <span aria-hidden="true">{isFavorite ? "⭐" : "☆"}</span>
          {isFavorite ? "Favorited" : "Favorite"}
        </button>
      </div>
    </div>
  );
}
