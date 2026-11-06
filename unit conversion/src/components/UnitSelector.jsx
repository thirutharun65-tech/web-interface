export default function UnitSelector({ id, units, value, onChange, label }) {
  return (
    <select id={id} value={value} onChange={(e) => onChange(e.target.value)} aria-label={label}>
      {Object.entries(units).map(([key, unit]) => (
        <option key={key} value={key}>
          {unit.label} ({unit.symbol})
        </option>
      ))}
    </select>
  );
}
