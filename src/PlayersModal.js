import React, { useState } from "react";
import gql from "graphql-tag";
import { useSubscription, useMutation } from "@apollo/react-hooks";

const GET_PLAYERS = gql`
  subscription GetPlayers {
    players {
      id
      nombre
    }
  }
`;

let PLAYERS = [];

const PlayersModal = props => {
  const { visible, closeModal } = props;
  const [playerChosen, setPlayerChosen] = useState(null);
  const { loading, error, data } = useSubscription(GET_PLAYERS);

  if (!loading) {
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
          <h1>Elige un jugador</h1>
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
