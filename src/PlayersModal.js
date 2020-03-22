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
  const [player, setPlayer] = useState(null);
  function handleSubmit() {
    console.log(player);
  }
  return (
    <React.Fragment>
      {visible ? (
        <div className="players-card">
          <h1>Elige un jugador</h1>
          <ul>
            {PLAYERS.map(player => (
              <li key={player.id} onClick={() => setPlayer(player.id)}>
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
