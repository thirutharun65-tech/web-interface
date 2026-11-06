import React from "react";

const collections = [
  "Grand Theft Auto Trilogy",
  "God of War Collection (Ragnarok, GOW 2018)",
  "Assassin's Creed Ezio Collection",
  "Resident Evil Collection (RE2, RE3, RE4 Remake)",
  "Uncharted Collection",
  "Batman Arkham Collection"
];

function GameCollections() {
  return (
    <div className="section">
      <h2>My Game Collections</h2>
      <ul className="game-list">
        {collections.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default GameCollections;
