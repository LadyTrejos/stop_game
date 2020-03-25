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
  let playerName = null;
  const [insertPlayer] = useMutation(INSERT_PLAYER);

  let playersOnTheGame = [];

  const playersOn = useSubscription(GET_PLAYERS_ON, {
    variables: { game_id: props.gameID },
    onSubscriptionData: ({ subscriptionData }) => {
      playersOnTheGame = subscriptionData.data.games_players.map(
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

  function createPlayer(e) {
    if (playerName.trim() === "") {
      alert("El nombre de usuario no puede ser vacío.");
    } else {
      const pattern = RegExp("^[a-zA-Z0-9]{1,}$");
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
    playerName = e.target.value;
  }

  return (
    <React.Fragment>
      {visible ? (
        <div className="players-card">
          <h1>Elige tu nombre de usuario</h1>
          <span>{`Total jugadores: ${props.numberOfPlayers}`}</span>
          <input type="text" onChange={e => onChange(e)}></input>
          <button onClick={e => createPlayer(e)} disabled={disabled}>
            {" "}
            Crear usuario
          </button>
        </div>
      ) : null}
    </React.Fragment>
  );
};

export default PlayersModal;
