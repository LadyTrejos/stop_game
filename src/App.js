import React from "react";
import { useSubscription } from "@apollo/react-hooks";
import sql from "graphql-tag";
import logo from "./logo.svg";

import "./App.scss";


const GET_POST = sql`
subscription GetStop {
  stop(where: {game_id: {_eq: 1}, player_id: {_neq: 2}}) {
    animal
    apellido
    ciudad
    color
    cosa
    fruta
    nombre
    pais
  }
}
`;

function App() {
  const { loading, error, data } = useSubscription(GET_POST);

  if (loading) {
    console.log("cargando");
  } else {
    console.log("data: ", data)}

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
