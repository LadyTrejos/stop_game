import React, { useState } from "react";
import { useSubscription } from "@apollo/react-hooks";
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
      id
      player {
        nombre
      }
      stop_scores {
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
  }
`;

export default function OpponentCard({ currentPlayer, game }) {
  const [allData, setAllData] = useState([]);

  const { loading, error, data } = useSubscription(GET_POST, {
    variables: { game_id: game, player_id: currentPlayer },
    onSubscriptionData: ({ subscriptionData }) => {
      setAllData(subscriptionData.data.stop);
    }
  });

  function total(scores) {
    let score = Object.entries(scores);
    let total = 0;
    score.map(item => {
      if (typeof item[1] === "number") {
        total = total + item[1];
      }
    });
    return total;
  }

  function renderData() {
    const listData = allData.map((newData, idx) => (
      <div className="card" key={idx}>
        <div className="footer">
          <span>Respuestas de {newData["player"]["nombre"]}</span>
        </div>
        <div className="table">
          <div className="col">
            <label>Nombre</label>
            <input type="text" value={newData["nombre"]} disabled></input>
            <input
              value={
                newData["stop_scores"].length > 0
                  ? newData["stop_scores"][0]["nombre"]
                  : "puntaje"
              }
              readOnly
            ></input>
          </div>
          <div className="col">
            <label>Apellido</label>
            <input type="text" value={newData["apellido"]} disabled></input>
            <input
              value={
                newData["stop_scores"].length > 0
                  ? newData["stop_scores"][0]["apellido"]
                  : "puntaje"
              }
              readOnly
            ></input>
          </div>
          <div className="col">
            <label>Ciudad</label>
            <input type="text" value={newData["ciudad"]} disabled></input>
            <input
              value={
                newData["stop_scores"].length > 0
                  ? newData["stop_scores"][0]["ciudad"]
                  : "puntaje"
              }
              readOnly
            ></input>
          </div>
          <div className="col">
            <label>País</label>
            <input type="text" value={newData["pais"]} disabled></input>
            <input
              value={
                newData["stop_scores"].length > 0
                  ? newData["stop_scores"][0]["pais"]
                  : "puntaje"
              }
              readOnly
            ></input>
          </div>
          <div className="col">
            <label>Animal</label>
            <input type="text" value={newData["animal"]} disabled></input>
            <input
              value={
                newData["stop_scores"].length > 0
                  ? newData["stop_scores"][0]["animal"]
                  : "puntaje"
              }
              readOnly
            ></input>
          </div>
          <div className="col">
            <label>Fruta</label>
            <input type="text" value={newData["fruta"]} disabled></input>
            <input
              value={
                newData["stop_scores"].length > 0
                  ? newData["stop_scores"][0]["fruta"]
                  : "puntaje"
              }
              readOnly
            ></input>
          </div>
          <div className="col">
            <label>Color</label>
            <input type="text" value={newData["color"]} disabled></input>
            <input
              value={
                newData["stop_scores"].length > 0
                  ? newData["stop_scores"][0]["color"]
                  : "puntaje"
              }
              readOnly
            ></input>
          </div>
          <div className="col">
            <label>Cosa</label>
            <input type="text" value={newData["cosa"]} disabled></input>
            <input
              value={
                newData["stop_scores"].length > 0
                  ? newData["stop_scores"][0]["cosa"]
                  : "puntaje"
              }
              readOnly
            ></input>
          </div>
          <div>
            Total:
            {newData["stop_scores"].length > 0
              ? total(newData["stop_scores"][0])
              : " ..."}
          </div>
          <div className="hole hole-top"></div>
          <div className="hole hole-middle"></div>
          <div className="hole hole-bottom"></div>
        </div>
      </div>
    ));

    return listData;
  }
  console.log("allData: ", allData);
  return (
    <div>
      <div className={`flip-card ${allData.length > 0 ? "flip" : ""}`}>
        <div className="flip-card-inner">
          <div className="flip-card-front">
            <div className="card">
              Jugando...<div className="hole hole-top-right"></div>
              <div className="hole hole-middle-right"></div>
              <div className="hole hole-bottom-right"></div>
            </div>
          </div>
          <div className={"flip-card-back"}>
            {allData.length > 0 ? renderData() : null}
          </div>
        </div>
      </div>
    </div>
  );
}
