import React, { useState } from "react";
import { useSubscription, useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import useStopForm from "./lib/CustomHooks";

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

  const { inputs, handleInputChange, handleSubmit } = useStopForm({
    nombre: "",
    apellido: "",
    ciudad: "",
    pais: "",
    animal: "",
    fruta: "",
    color: "",
    cosa: ""
  });

  const { loading, error, data } = useSubscription(GET_POST, {
    variables: { game_id: gameID, player_id: playerID }
  });

  if (loading) {
    console.log("cargando");
  } else {
    console.log("data: ", data);
  }

  return (
    <React.Fragment>
      <form className="table" onSubmit={e => handleSubmit(e, inputs)}>
        <div className="card">
          <div className="row">
            <label className="cell">Nombre</label>
            <label className="cell">Apellido</label>
            <label className="cell">Ciudad</label>
            <label className="cell">País</label>
          </div>
          <div className="row">
            <div className="cell">
              <input
                name="nombre"
                type="text"
                onChange={handleInputChange}
                value={inputs.nombre}
              />
            </div>
            <div className="cell">
              <input
                name="apellido"
                type="text"
                onChange={handleInputChange}
                value={inputs.apellido}
              />
            </div>
            <div className="cell">
              <input
                name="ciudad"
                type="text"
                onChange={handleInputChange}
                value={inputs.ciudad}
              />
            </div>
            <div className="cell">
              <input
                name="pais"
                type="text"
                onChange={handleInputChange}
                value={inputs.pais}
              />
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
              <input
                name="animal"
                type="text"
                onChange={handleInputChange}
                value={inputs.animal}
              />
            </div>
            <div className="cell">
              <input
                name="fruta"
                type="text"
                onChange={handleInputChange}
                value={inputs.fruta}
              />
            </div>
            <div className="cell">
              <input
                name="color"
                type="text"
                onChange={handleInputChange}
                value={inputs.color}
              />
            </div>
            <div className="cell">
              <input
                name="cosa"
                type="text"
                onChange={handleInputChange}
                value={inputs.cosa}
              />
            </div>
          </div>
          <div className="hole hole-top"></div>
          <div className="hole hole-middle"></div>
          <div className="hole hole-bottom"></div>
        </div>
        <button type="submit" className="stop-button">
          Stop
        </button>
      </form>
    </React.Fragment>
  );
}
