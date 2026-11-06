/**
 * Formats a number for display:
 * - Rounds to `precision` decimal places
 * - Strips trailing zeros
 * - Adds thousands separators
 * - Avoids scientific notation unless the number is extremely large/small
 */
export function formatNumber(value, precision = 4) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  if (!Number.isFinite(value)) return "∞";

  const absValue = Math.abs(value);

  // Extremely large or extremely small -> allow scientific notation
  if (absValue !== 0 && (absValue >= 1e21 || absValue < 1e-9)) {
    return value.toExponential(4);
  }

  const rounded = Number(value.toFixed(precision));

  // Determine how many decimals to actually show (strip trailing zeros)
  const parts = rounded.toString().split(".");
  const decimalPart = parts[1] ? parts[1].slice(0, precision) : "";
  const trimmedDecimal = decimalPart.replace(/0+$/, "");

  const intPart = Math.trunc(Math.abs(rounded)).toString();
  const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const sign = rounded < 0 ? "-" : "";

  return trimmedDecimal ? `${sign}${withCommas}.${trimmedDecimal}` : `${sign}${withCommas}`;
}

export function formatTimestamp(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString();
}
