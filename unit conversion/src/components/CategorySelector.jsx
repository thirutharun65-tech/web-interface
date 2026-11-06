import { categories } from "../data/units";

export default function CategorySelector({ activeCategory, onSelect }) {
  const entries = Object.entries(categories);

  return (
    <nav aria-label="Conversion categories">
      <p className="section-eyebrow">Categories</p>

      <select
        className="category-select-mobile"
        value={activeCategory}
        onChange={(e) => onSelect(e.target.value)}
        aria-label="Select conversion category"
      >
        {entries.map(([key, cat]) => (
          <option key={key} value={key}>
            {cat.icon} {cat.label}
          </option>
        ))}
      </select>

      <ul className="category-list">
        {entries.map(([key, cat]) => (
          <li className="category-item" key={key}>
            <button
              type="button"
              className={key === activeCategory ? "active" : ""}
              onClick={() => onSelect(key)}
              aria-current={key === activeCategory ? "true" : undefined}
            >
              <span aria-hidden="true">{cat.icon}</span>
              {cat.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
