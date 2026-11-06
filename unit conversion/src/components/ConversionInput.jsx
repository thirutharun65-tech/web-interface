import UnitSelector from "./UnitSelector";

export default function ConversionInput({
  id,
  label,
  units,
  unitValue,
  onUnitChange,
  numberValue,
  onNumberChange,
  editable,
  error,
}) {
  return (
    <div className="field-group">
      <label htmlFor={`${id}-input`}>{label}</label>
      <div className={`field-box${error ? " error" : ""}`}>
        {editable ? (
          <input
            id={`${id}-input`}
            type="number"
            inputMode="decimal"
            placeholder="0"
            value={numberValue}
            onChange={(e) => onNumberChange(e.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : undefined}
          />
        ) : (
          <div
            id={`${id}-input`}
            role="status"
            aria-live="polite"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 24,
              fontWeight: 600,
              padding: "2px 0 8px",
              minHeight: 34,
            }}
          >
            {numberValue}
          </div>
        )}
        <UnitSelector id={`${id}-unit`} units={units} value={unitValue} onChange={onUnitChange} label={`${label} unit`} />
      </div>
      {error && (
        <p className="input-error" id={`${id}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
