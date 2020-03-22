import React from "react";
import logo from "./logo.svg";
import "./App.scss";

function App() {
  function newGame() {
    console.log("nueva partida");
  }

  return (
    <div className="App">
      <div className="stop-title">Stop!</div>
      <div className="new-game">
        <button onClick={() => newGame()}>Nueva partida</button>
      </div>
    </div>
  );
}

export default App;
