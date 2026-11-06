import React from "react";

const galleryGames = [
  { name: "GTA 5", image: "/images/gta5.jpg" },
  { name: "God of War", image: "/images/godofwar.jpg" },
  { name: "Assassin's Creed", image: "/images/assassinscreed.jpg" },
  { name: "Ghost of Tsushima", image: "/images/ghostoftsushima.jpg" },
  { name: "Resident Evil 4", image: "/images/residentevil4.jpg" },
  { name: "Free Fire", image: "/images/freefire.jpg" }
];

function GameGallery() {
  return (
    <div className="section">
      <h2>My Game Gallery</h2>
      <div className="gallery">
        {galleryGames.map((game, index) => (
          <div key={index} className="gallery-item">
            <img src={game.image} alt={game.name} />
            <p>{game.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GameGallery;
