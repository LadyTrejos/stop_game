import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation, useSubscription } from "@apollo/react-hooks";

const GET_PLAYERS_ON = gql`
  subscription GetPlayerOn($game_id: Int!) {
    games_players(where: { game_id: { _eq: $game_id } }) {
      player_id
    }
  }
`;

const INSERT_PLAYER = gql`
  mutation InsertPlayer($nombre: String!) {
    insert_players(objects: { nombre: $nombre }) {
      returning {
        id
        nombre
      }
    }
  }
`;

const PlayersModal = props => {
  const { visible, closeModal } = props;
  const [disabled, setDisabled] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [insertPlayer] = useMutation(INSERT_PLAYER);

  const playersOn = useSubscription(GET_PLAYERS_ON, {
    variables: { game_id: props.gameID },
    onSubscriptionData: ({ subscriptionData }) => {
      let playersOnTheGame = subscriptionData.data.games_players.map(
        player => player.player_id
      );

      if (playersOnTheGame.length === props.numberOfPlayers) {
        setDisabled(true);
        window.location.reload();
        alert(
          "Lo sentimos, ya están completos los jugadores para esta partida"
        );
      }
    }
  });

  function createPlayer(e, playerName) {
    if (playerName.trim() === "") {
      alert("El nombre de usuario no puede ser vacío.");
    } else {
      const pattern = RegExp(
        "^[a-zA-Z0-9äáàëéèíìïöóòúüùñÁÉÍÓÚÀÈÌÒÙÄËÏÖÜÑ]{1,}$"
      );
      playerName = playerName.trim();
      if (pattern.test(playerName)) {
        insertPlayer({ variables: { nombre: playerName } }).then(res => {
          props.getPlayerInfo(
            res.data.insert_players.returning[0].id,
            playerName
          );
          closeModal();
        });
      }
    }
  }

  function onChange(e) {
    setPlayerName(e.target.value);
  }

  return (
    <React.Fragment>
      {visible ? (
        <div className="players-card">
          <h1>Elige tu nombre de usuario</h1>
          <span>{`Total jugadores en la partida: ${
            playersOn.data ? playersOn.data.games_players.length : 0
          }/${props.numberOfPlayers}`}</span>
          <input
            type="text"
            onChange={e => onChange(e)}
            placeholder="Nombre de usuario"
          ></input>
          <button
            className="purple-button"
            onClick={e => createPlayer(e, playerName)}
            disabled={disabled}
          >
            Crear usuario
          </button>
        </div>
      ) : null}
    </React.Fragment>
  );
};

export default PlayersModal;
