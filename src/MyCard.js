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

const INSERT_GAME_PLAYER = gql`
  mutation InsertGamePlayer($game_id: Int!, $player_id: Int!) {
    insert_games_players(
      objects: { game_id: $game_id, player_id: $player_id }
    ) {
      returning {
        id
      }
    }
  }
`;

const GET_GAME_PLAYER = gql`
  subscription GetGamePlayer($game_id: Int!) {
    games_players(where: { game_id: { _eq: $game_id } }) {
      player_id
    }
  }
`;

const DELETE_PLAYER_ON_GAME = gql`
  mutation DeletePlayerOnGame($player_id: Int!) {
    delete_games_players(where: { player_id: { _eq: $player_id } }) {
      returning {
        id
      }
    }
  }
`;
export default function MyCard({
  currentPlayer,
  currentPlayerName,
  game,
  gameLetter,
  numberOfPlayers
}) {
  const [insertGame] = useMutation(INSERT_STOP);
  const [insertGamePlayer] = useMutation(INSERT_GAME_PLAYER);
  const [deleteGameOnPlayer] = useMutation(DELETE_PLAYER_ON_GAME);

  const [gameID, setGameID] = useState(game);
  const [playerID, setPlayerID] = useState(currentPlayer);
  const [formError, setFormError] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [disabledInput, setDisabledInput] = useState(true);
  const [loadData, setLoadData] = useState(false);
  const [listening, setListening] = useState(true);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [isTheEnd, setIsTheEnd] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // const [visibleLetter, setVisibleLetter] = useState(false);
  const { loading, error, data = {} } = useSubscription(GET_POST, {
    variables: { game_id: gameID, player_id: playerID }
  });

  let visibleLetter = false;

  function disableButton() {
    //desabilita el botón de stop para que no se oprima varias veces y haga muchos insert
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

  if (isFirstTime) {
    //si es la primera vez que entra a la partida actual,
    //registra el id del jugador con el id de la partida actual
    setIsFirstTime(false);
    insertGamePlayer({
      variables: { game_id: game, player_id: currentPlayer }
    });
  }

  const getGamePlayer = useSubscription(GET_GAME_PLAYER, {
    variables: { game_id: game }
  });

  function wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
      end = new Date().getTime();
    }
  }
  if (!getGamePlayer.loading) {
    let bloqueo = false;
    //si solo hay un jugador desabilita todos los campos
    if (getGamePlayer.data.games_players.length < numberOfPlayers) {
      bloqueo = true;
      if (!disabled && !disabledInput) {
        setDisabled(true);
        setDisabledInput(true);
      }
    } else {
      //cuando los jugadores se completan, todo se habilita para que empiece el juego
      visibleLetter = true;

      if (getGamePlayer.data.games_players.length === numberOfPlayers) {
        if (disabled && disabledInput && !isReady) {
          setDisabled(false);
          setDisabledInput(false);
          setIsReady(true);
        }
        bloqueo = true;
        wait(1);
      }
      console.log("bloqueo: ", bloqueo);
      if (!bloqueo) {
        //si bloqueo es falso, quiere decir que el jugador no se registró cuando aún habían cupos disponibles,
        //así que se borra de la partida y se dirige a la pádina de inicio
        deleteGameOnPlayer({ variables: { player_id: currentPlayer } });
        window.location.reload();
        alert(
          "Lo sentimos, hubo un jugador que se registró antes que tú y ocupó el tope de la partida"
        );
      }
    }
  }

  if (!loading) {
    // Si el otro jugador da stop, deshabilita mis campos
    if (data.stop.length > 0 && !disabledInput) {
      setDisabledInput(true);
      setDisabled(true);
      setLoadData(true);
      setIsTheEnd(true);
    }
  }

  if (disabledInput && loadData && listening) {
    //cuando el oponente da stop, envía los datos a la base de datos
    setLoadData(false);
    setListening(false);
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
      <div>{`${currentPlayerName}`}</div>
      <form
        onSubmit={e => handleSubmit(e, inputs, disableButton)}
        autoComplete="off"
      >
        <div style={{ paddingTop: "50px" }}>
          Letra: {visibleLetter ? gameLetter : ""}
        </div>

        <div className="card table">
          <div>{formError}</div>
          <div>
            <div className="col">
              <label>Nombre</label>
              <input
                name="nombre"
                type="text"
                onChange={e => onChange(e)}
                value={inputs.nombre}
                disabled={disabledInput}
              />
            </div>
            <div className="col">
              <label>Apellido</label>
              <input
                name="apellido"
                type="text"
                onChange={e => onChange(e)}
                value={inputs.apellido}
                disabled={disabledInput}
              />
            </div>
            <div className="col">
              <label>Ciudad</label>
              <input
                name="ciudad"
                type="text"
                onChange={e => onChange(e)}
                value={inputs.ciudad}
                disabled={disabledInput}
              />
            </div>
            <div className="col">
              <label>País</label>
              <input
                name="pais"
                type="text"
                onChange={e => onChange(e)}
                value={inputs.pais}
                disabled={disabledInput}
              />
            </div>
            <div className="col">
              <label>Animal</label>
              <input
                name="animal"
                type="text"
                onChange={e => onChange(e)}
                value={inputs.animal}
                disabled={disabledInput}
              />
            </div>
            <div className="col">
              <label>Fruta</label>
              <input
                name="fruta"
                type="text"
                onChange={e => onChange(e)}
                value={inputs.fruta}
                disabled={disabledInput}
              />
            </div>
            <div className="col">
              <label>Color</label>
              <input
                name="color"
                type="text"
                onChange={e => onChange(e)}
                value={inputs.color}
                disabled={disabledInput}
              />
            </div>
            <div className="col">
              <label>Cosa</label>
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
          {/* <div className="hole hole-middle"></div> */}
          <div className="hole hole-bottom"></div>
        </div>
        <button
          type="submit"
          className={`stop-button ${isTheEnd ? "end" : ""}`}
          disabled={disabled}
        >
          Stop!
        </button>
      </form>
    </React.Fragment>
  );
}
