import React, { useState } from "react";
import { useSubscription, useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

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

export default function MyCard({ currentPlayer, game }) {
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

  return (
    <div className="card">
      <h1>{game}</h1>
      <form className="table">
        <div className="row">
          <label className="cell">Nombre</label>
          <label className="cell">Apellido</label>
          <label className="cell">Ciudad</label>
          <label className="cell">País</label>
        </div>
        <div className="row">
          <div className="cell">
            <input id="nombre" type="text"></input>
          </div>
          <div className="cell">
            <input id="apellido" type="text"></input>
          </div>
          <div className="cell">
            <input id="ciudad" type="text"></input>
          </div>
          <div className="cell">
            <input id="pais" type="text"></input>
          </div>
        </div>
        <br />
        <div className="row">
          <label className="cell">Animal</label>
          <label className="cell">Fruta</label>
          <label className="cell">Color</label>
          <label className="cell">Cosa</label>
        </div>
        <div className="row">
          <div className="cell">
            <input id="animal" type="text"></input>
          </div>
          <div className="cell">
            <input id="fruta" type="text"></input>
          </div>
          <div className="cell">
            <input id="color" type="text"></input>
          </div>
          <div className="cell">
            <input id="cosa" type="text"></input>
          </div>
        </div>
      </form>
      <div className="hole hole-top"></div>
      <div className="hole hole-middle"></div>
      <div className="hole hole-bottom"></div>
    </div>
  );
}
