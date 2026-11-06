import { quickConversions } from "../data/units";

export default function QuickConversions({ onSelect }) {
  return (
    <div>
      <p className="section-eyebrow">Quick Conversions</p>
      <div className="quick-list">
        {quickConversions.map((qc, idx) => (
          <button type="button" className="quick-item" key={idx} onClick={() => onSelect(qc)}>
            {qc.label}
          </button>
        ))}
      </div>
    </div>
  );
}
