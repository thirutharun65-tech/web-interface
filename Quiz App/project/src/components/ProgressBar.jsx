// Simple progress bar.
export default function ProgressBar({ value, max = 100, label }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="progress-bar-wrap">
      {label && <span className="progress-bar-label">{label}</span>}
      <div className="progress-bar-track">
        <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="progress-bar-pct">{pct}%</span>
    </div>
  );
}
