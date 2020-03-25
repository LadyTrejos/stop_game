import React, { useState } from "react";
import gql from "graphql-tag";
import { useSubscription, useLazyQuery, useQuery } from "@apollo/react-hooks";

const GET_PLAYERS = gql`
  query GetPlayers($player_id: [Int!]) {
    players(where: { id: { _nin: $player_id } }) {
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

let PLAYERS = [];
let playersOnGame = [];

const PlayersModal = props => {
  const { visible, closeModal } = props;
  const [playerChosen, setPlayerChosen] = useState(null);
  const [getAvailablePlayers, { called, loading, data }] = useLazyQuery(
    GET_PLAYERS
  );

  const playersOn = useSubscription(GET_PLAYERS_ON, {
    variables: { game_id: props.gameID },
    onSubscriptionData: ({ subscriptionData }) => {
      const playersOnTheGame = subscriptionData.data.games_players.map(
        player => player.player_id
      );
      getAvailablePlayers({ variables: { player_id: playersOnTheGame } });
      setPlayerChosen(null);
    }
  });

  if (called && !loading) {
    console.log("data: ", data);
    PLAYERS = data.players;
  }

  function handleSubmit() {
    props.getPlayerID(playerChosen);
    closeModal();
  }

  return (
    <React.Fragment>
      {visible ? (
        <div className="players-card">
          <h1>Elige un jugador {props.numberOfPlayers}</h1>
          <ul>
            {PLAYERS.map(player => (
              <li
                key={player.id}
                onClick={() => setPlayerChosen(player.id)}
                className={player.id == playerChosen ? "selected" : ""}
              >
                {player.nombre}
              </li>
            ))}
            <button
              onClick={() => handleSubmit()}
              disabled={!playerChosen ? true : false}
            >
              Aceptar
            </button>
          </ul>
        </div>
      ) : null}
    </React.Fragment>
  );
};

export default PlayersModal;
