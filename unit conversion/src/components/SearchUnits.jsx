import { useState } from "react";
import { getAllUnitsFlat } from "../data/units";

const allUnits = getAllUnitsFlat();

export default function SearchUnits({ onPick }) {
  const [query, setQuery] = useState("");

  const results =
    query.trim().length > 0
      ? allUnits
          .filter((u) => {
            const q = query.trim().toLowerCase();
            return u.label.toLowerCase().includes(q) || u.symbol.toLowerCase().includes(q);
          })
          .slice(0, 8)
      : [];

  const handlePick = (unit) => {
    onPick(unit);
    setQuery("");
  };

  return (
    <div className="search-box">
      <span className="search-icon" aria-hidden="true">
        🔍
      </span>
      <input
        type="text"
        placeholder="Search units... (meter, kilogram, fahrenheit)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search units"
      />
      {results.length > 0 && (
        <div className="search-results" role="listbox">
          {results.map((u) => (
            <button
              type="button"
              className="search-result-item"
              key={`${u.categoryKey}-${u.unitKey}`}
              onClick={() => handlePick(u)}
              role="option"
            >
              <span>
                {u.label} ({u.symbol})
              </span>
              <span className="cat-tag">{u.categoryLabel}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
