import React, { useState } from "react";

const PLAYERS = [
  {
    nombre: "lady",
    id: 1
  },
  {
    nombre: "ivan",
    id: 2
  }
];

const PlayersModal = props => {
  const { visible, closeModal } = props;
  const [playerChosen, setPlayerChosen] = useState(null);

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
