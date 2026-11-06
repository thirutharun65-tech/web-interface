import React from "react";

const favouriteGames = [
  "Free Fire",
  "GTA 5",
  "God of War",
  "Assassin's Creed",
  "Ghost of Tsushima",
  "Resident Evil 4"
];

function FavouriteGames() {
  return (
    <div className="section">
      <h2>My Favourite Games</h2>
      <ul className="game-list">
        {favouriteGames.map((game, index) => (
          <li key={index}>{game}</li>
        ))}
      </ul>
    </div>
  );
}

export default FavouriteGames;
