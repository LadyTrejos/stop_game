import React, { useState } from "react";
import { useSubscription, useMutation } from "@apollo/react-hooks";
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

const INSERT_STOP = gql`
  mutation InsertStop(
    $animal: String!
    $apellido: String!
    $ciudad: String!
    $color: String!
    $cosa: String!
    $fruta: String!
    $nombre: String!
    $pais: String!
    $player_id: Int!
    $game_id: Int!
  ) {
    insert_stop(
      objects: {
        animal: $animal
        apellido: $apellido
        ciudad: $ciudad
        color: $color
        cosa: $cosa
        fruta: $fruta
        nombre: $nombre
        pais: $pais
        player_id: $player_id
        game_id: $game_id
      }
    ) {
      returning {
        id
      }
    }
  }
`;

export default function MyCard({ currentPlayer, game, gameLetter }) {
  const [insertGame] = useMutation(INSERT_STOP);
  const [gameID, setGameID] = useState(game);
  const [playerID, setPlayerID] = useState(currentPlayer);
  const [formError, setFormError] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [disabledInput, setDisabledInput] = useState(false);
  const [loadData, setLoadData] = useState(false);
  const [listening, setListening] = useState(true);

  function disableButton() {
    setDisabled(true);
    setListening(false);
  }

  const { inputs, handleInputChange, handleSubmit } = useStopForm(
    {
      nombre: "",
      apellido: "",
      ciudad: "",
      pais: "",
      animal: "",
      fruta: "",
      color: "",
      cosa: "",
      game_id: gameID,
      player_id: playerID
    },
    ({ err }) => setFormError(err)
  );

  const { loading, error, data } = useSubscription(GET_POST, {
    variables: { game_id: gameID, player_id: playerID }
  });

  if (loading) {
    console.log("cargando");
  } else {
    // console.log("data: ", data);
    if (data.stop.length > 0 && !disabledInput) {
      setDisabledInput(true);
      setDisabled(true);
    }
  }

  if (disabledInput && !loadData && listening) {
    setLoadData(true);
    let viewValues = Object.entries(inputs);

    insertGame({
      variables: {
        animal: viewValues[4][1],
        apellido: viewValues[1][1],
        ciudad: viewValues[2][1],
        color: viewValues[6][1],
        cosa: viewValues[7][1],
        fruta: viewValues[5][1],
        nombre: viewValues[0][1],
        pais: viewValues[3][1],
        player_id: viewValues[9][1],
        game_id: viewValues[8][1]
      }
    });
  }

  function onChange(e) {
    handleInputChange(e);
    setFormError(null);
  }

  return (
    <React.Fragment>
      <form
        className="table"
        onSubmit={e => handleSubmit(e, inputs, disableButton)}
        autoComplete="off"
      >
        <div style={{ paddingTop: "30px" }}>Letra: {gameLetter}</div>
        <div className="card">
          <div>{formError}</div>
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
                onChange={e => onChange(e)}
                value={inputs.nombre}
                disabled={disabledInput}
              />
            </div>
            <div className="cell">
              <input
                name="apellido"
                type="text"
                onChange={e => onChange(e)}
                value={inputs.apellido}
                disabled={disabledInput}
              />
            </div>
            <div className="cell">
              <input
                name="ciudad"
                type="text"
                onChange={e => onChange(e)}
                value={inputs.ciudad}
                disabled={disabledInput}
              />
            </div>
            <div className="cell">
              <input
                name="pais"
                type="text"
                onChange={e => onChange(e)}
                value={inputs.pais}
                disabled={disabledInput}
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
                onChange={e => onChange(e)}
                value={inputs.animal}
                disabled={disabledInput}
              />
            </div>
            <div className="cell">
              <input
                name="fruta"
                type="text"
                onChange={e => onChange(e)}
                value={inputs.fruta}
                disabled={disabledInput}
              />
            </div>
            <div className="cell">
              <input
                name="color"
                type="text"
                onChange={e => onChange(e)}
                value={inputs.color}
                disabled={disabledInput}
              />
            </div>
            <div className="cell">
              <input
                name="cosa"
                type="text"
                onChange={e => onChange(e)}
                value={inputs.cosa}
                disabled={disabledInput}
              />
            </div>
          </div>
          <div className="hole hole-top"></div>
          <div className="hole hole-middle"></div>
          <div className="hole hole-bottom"></div>
        </div>
        <button type="submit" className="stop-button" disabled={disabled}>
          Stop
        </button>
      </form>
    </React.Fragment>
  );
}
