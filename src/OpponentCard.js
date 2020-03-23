import React, { useState } from "react";
import { useSubscription, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

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

export default function MyCard({ currentPlayer, game }) {
  const [empty, setEmpty] = useState(true);
  let newData = null;

  const { loading, error, data } = useSubscription(GET_POST, {
    variables: { game_id: game, player_id: currentPlayer }
  });

  if (loading) {
    console.log("cargando");
  } else {
    console.log("data: ", data);

    if (data.stop.length > 0) {
      newData = Object.entries(data.stop[0]);
    }

    console.log("newData: ", newData);
  }

  return (
    <div className="table">
      <div class="flip-card">
        <div class="flip-card-inner">
          <div class="flip-card-front">
            <div className="card">
              Jugando...<div className="hole hole-top-right"></div>
              <div className="hole hole-middle-right"></div>
              <div className="hole hole-bottom-right"></div>
            </div>
          </div>
          <div class="flip-card-back">
            <div className="card">
              <div className="row">
                <label className="cell">Nombre</label>
                <label className="cell">Apellido</label>
                <label className="cell">Ciudad</label>
                <label className="cell">País</label>
              </div>
              <div className="row">
                <div className="cell">
                  <input
                    id="nombre"
                    type="text"
                    defaultValue={newData ? newData[6][1] : ""}
                    disabled
                  ></input>
                </div>
                <div className="cell">
                  <input
                    id="apellido"
                    type="text"
                    defaultValue={newData ? newData[1][1] : ""}
                    disabled
                  ></input>
                </div>
                <div className="cell">
                  <input
                    id="ciudad"
                    type="text"
                    defaultValue={newData ? newData[2][1] : ""}
                    disabled
                  ></input>
                </div>
                <div className="cell">
                  <input
                    id="pais"
                    type="text"
                    defaultValue={newData ? newData[7][1] : ""}
                    disabled
                  ></input>
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
                    id="animal"
                    type="text"
                    defaultValue={newData ? newData[0][1] : ""}
                    disabled
                  ></input>
                </div>
                <div className="cell">
                  <input
                    id="fruta"
                    type="text"
                    defaultValue={newData ? newData[5][1] : ""}
                    disabled
                  ></input>
                </div>
                <div className="cell">
                  <input
                    id="color"
                    type="text"
                    defaultValue={newData ? newData[3][1] : ""}
                    disabled
                  ></input>
                </div>
                <div className="cell">
                  <input
                    id="cosa"
                    type="text"
                    defaultValue={newData ? newData[4][1] : ""}
                    disabled
                  ></input>
                </div>
              </div>
              <div className="hole hole-top"></div>
              <div className="hole hole-middle"></div>
              <div className="hole hole-bottom"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
