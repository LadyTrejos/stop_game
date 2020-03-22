import React, { useState } from "react";
import { useSubscription, useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import logo from "./logo.svg";

import "./App.scss";

const GET_POST = gql`
  subscription GetStop($game_id: Int!, $player_id: Int!) {
    stop(
      where: { game_id: { _eq: $game_id }, player_id: { _neq: $player_id } }
    ) {
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

const GET_POST2 = gql`
  subscription GetStop($game_id: Int!, $player_id: Int!) {
    stop(
      where: { game_id: { _eq: $game_id }, player_id: { _neq: $player_id } }
    ) {
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

const INSERT_GAME = gql`
  mutation InsertGame {
    insert_games(objects: {}) {
      returning {
        id
      }
    }
  }
`;

function App() {
  const [InsertGame] = useMutation(INSERT_GAME);
  const [gameID, setGameID] = useState(null);
  const [playerID, setPlayerID] = useState(null);
  const { loading, error, data } = useSubscription(GET_POST, {
    variables: { game_id: gameID, player_id: playerID }
  });

  if (loading) {
    console.log("cargando");
  } else {
    console.log("data: ", data);
  }

  function newGame() {
    // InsertGame(); //descomentar
    console.log("nueva partida");
    setGameID(1);
    setPlayerID(2);
  }
  let stops = null;
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
