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
    if (data.stop.length > 0) {
      newData = Object.entries(data.stop[0]);
    }

    console.log("newData: ", newData);
  }
  return (
    <div>
      <div className={`flip-card ${newData ? "flip" : ""}`}>
        <div className="flip-card-inner">
          <div className="flip-card-front">
            <div className="card table">
              Jugando...<div className="hole hole-top-right"></div>
              <div className="hole hole-middle-right"></div>
              <div className="hole hole-bottom-right"></div>
            </div>
          </div>
          <div className={"flip-card-back"}>
            <div className="card table">
              <div>
                <div className="col">
                  <label>Nombre</label>
                  <input
                    id="nombre"
                    type="text"
                    defaultValue={newData ? newData[6][1] : ""}
                    disabled
                  ></input>
                </div>
                <div className="col">
                  <label>Apellido</label>
                  <input
                    id="apellido"
                    type="text"
                    defaultValue={newData ? newData[1][1] : ""}
                    disabled
                  ></input>
                </div>
                <div className="col">
                  <label>Ciudad</label>
                  <input
                    id="ciudad"
                    type="text"
                    defaultValue={newData ? newData[2][1] : ""}
                    disabled
                  ></input>
                </div>
                <div className="col">
                  <label>País</label>
                  <input
                    id="pais"
                    type="text"
                    defaultValue={newData ? newData[7][1] : ""}
                    disabled
                  ></input>
                </div>
                <div className="col">
                  <label>Animal</label>
                  <input
                    id="animal"
                    type="text"
                    defaultValue={newData ? newData[0][1] : ""}
                    disabled
                  ></input>
                </div>
                <div className="col">
                  <label>Fruta</label>
                  <input
                    id="fruta"
                    type="text"
                    defaultValue={newData ? newData[5][1] : ""}
                    disabled
                  ></input>
                </div>
                <div className="col">
                  <label>Color</label>
                  <input
                    id="color"
                    type="text"
                    defaultValue={newData ? newData[3][1] : ""}
                    disabled
                  ></input>
                </div>
                <div className="col">
                  <label>Cosa</label>
                  <input
                    id="cosa"
                    type="text"
                    defaultValue={newData ? newData[4][1] : ""}
                    disabled
                  ></input>
                </div>
                <div className="hole hole-top"></div>
                <div className="hole hole-middle"></div>
                <div className="hole hole-bottom"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
