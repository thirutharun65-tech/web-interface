import { categories } from "../data/units";

function describeFavorite(fav) {
  const cat = categories[fav.category];
  if (!cat) return null;
  const from = cat.units[fav.from];
  const to = cat.units[fav.to];
  if (!from || !to) return null;
  return `${from.label} → ${to.label}`;
}

export default function Favorites({ favorites, onSelect }) {
  return (
    <div className="list-card">
      <div className="list-header">
        <h3>⭐ Favorite Conversions</h3>
      </div>
      {favorites.length === 0 ? (
        <p className="empty-note">
          Tap the star next to a result to save it here for quick access.
        </p>
      ) : (
        favorites.map((fav, idx) => {
          const text = describeFavorite(fav);
          if (!text) return null;
          return (
            <div className="favorite-row" key={`${fav.category}-${fav.from}-${fav.to}-${idx}`}>
              <button type="button" onClick={() => onSelect(fav)}>
                {text}
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}
