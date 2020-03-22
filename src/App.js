import React, { useState } from "react";
import { useSubscription } from "@apollo/react-hooks";
import sql from "graphql-tag";

import "./App.scss";
import MyCard from "./MyCard";

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
  const [active, setActive] = useState(false);
  const { loading, error, data } = useSubscription(GET_POST);

  if (loading) {
    console.log("cargando");
  } else {
    console.log("data: ", data);
  }

  function newGame() {
    setActive(true);
    console.log("nueva partida");
  }

  return (
    <div className="App">
      <div className="stop-title">Stop!</div>
      <button onClick={() => newGame()} className="new-game">
        Nueva partida
      </button>
      <MyCard currentPlayer={1} game={1} />
    </div>
  );
}

export default App;
