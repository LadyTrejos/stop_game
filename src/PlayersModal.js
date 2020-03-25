import React, { useState } from "react";
import gql from "graphql-tag";
import {
  useSubscription,
  useLazyQuery,
  useMutation
} from "@apollo/react-hooks";

const GET_PLAYERS = gql`
  query GetPlayers($player_id: [Int!], $limit: Int!) {
    players(where: { id: { _nin: $player_id } }, limit: $limit) {
      id
      nombre
    }
  }
`;

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
let PLAYERS = [];
let playersOnGame = [];

const PlayersModal = props => {
  const { visible, closeModal } = props;
  let playerName = null;
  const [insertPlayer] = useMutation(INSERT_PLAYER);

  function createPlayer(e) {
    if (playerName.trim() === "") {
      alert("El nombre de usuario no puede ser vacio");
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
          <h1>Elige tu nombre de usuario {props.numberOfPlayers}</h1>
          <input type="text" onChange={e => onChange(e)}></input>
          <button onClick={e => createPlayer(e)}> Crear usuario</button>
        </div>
      ) : null}
    </React.Fragment>
  );
};

export default PlayersModal;
