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
    console.log("data: ", data);
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
