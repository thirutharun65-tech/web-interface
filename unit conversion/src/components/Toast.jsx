export default function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="toast" role="status" aria-live="polite">
      <span aria-hidden="true">✓</span>
      {message}
    </div>
  );
}
