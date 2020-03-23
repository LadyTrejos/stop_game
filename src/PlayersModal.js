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

const PlayersModal = ({ visible, closeModal }) => {
  const [playerChosen, setPlayerChosen] = useState(null);
  function handleSubmit() {
    console.log(playerChosen);
    if (playerChosen) {
      closeModal();
    } else {
      alert("Elije un jugador.");
    }
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
            <button onClick={() => handleSubmit()}>Aceptar</button>
          </ul>
        </div>
      ) : null}
    </React.Fragment>
  );
};

export default PlayersModal;
