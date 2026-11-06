import React from "react";
import Header from "./components/Header";
import Hobby from "./components/Hobby";
import FavouriteGames from "./components/FavouriteGames";
import GameCollections from "./components/GameCollections";
import GameGallery from "./components/GameGallery";
import About from "./components/About";

function App() {
  return (
    <div className="app">
      <Header />
      <Hobby />
      <FavouriteGames />
      <GameCollections />
      <GameGallery />
      <About />
    </div>
  );
}

export default App;
