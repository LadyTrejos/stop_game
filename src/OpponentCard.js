import React, { useState } from "react";
import { useSubscription } from "@apollo/react-hooks";
import gql from "graphql-tag";
import ScoreSelector from "./ScoreSelector";

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

const GET_PLAYERS_NAMES = gql`
  subscription GetPlayersNames($game_id: Int!) {
    games_players(where: { game_id: { _eq: $game_id } }) {
      player {
        nombre
        id
      }
    }
  }
`;

export default function OpponentCard({ currentPlayer, game }) {
  const [allData, setAllData] = useState([]);
  const [players, setPlayers] = useState([]);

  const { loading, error, data } = useSubscription(GET_POST, {
    variables: { game_id: game, player_id: currentPlayer },
    onSubscriptionData: ({ subscriptionData }) => {
      setAllData(subscriptionData.data.stop);
    }
  });

  const getPlayersNames = useSubscription(GET_PLAYERS_NAMES, {
    variables: { game_id: game },
    onSubscriptionData: ({ subscriptionData }) => {
      const playersArray = subscriptionData.data.games_players
        .filter(item => item["player"]["id"] !== currentPlayer)
        .map(item => item["player"]["nombre"]);
      setPlayers(playersArray);
    }
  });

  function total(scores) {
    let total = 0;

    for (const key in scores) {
      if (typeof scores[key] === "number") {
        total += scores[key];
      }
    }
    return `Total: ${total}`;
  }

  function renderData() {
    const listData = allData.map((newData, idx) => (
      <div className="card" key={idx}>
        <div className="header">
          <span></span>
          <span>{newData["player"]["nombre"]}</span>
        </div>
        <div className="table">
          <div className="col">
            <label>Nombre</label>
            <input type="text" value={newData["nombre"]} disabled></input>
            {newData["stop_scores"].length > 0 ? (
              <ScoreSelector
                fieldName="nombre"
                readOnly={true}
                selectedItem={newData["stop_scores"][0]["nombre"]}
              />
            ) : null}
          </div>
          <div className="col">
            <label>Apellido</label>
            <input type="text" value={newData["apellido"]} disabled></input>
            {newData["stop_scores"].length > 0 ? (
              <ScoreSelector
                fieldName="apellido"
                readOnly={true}
                selectedItem={newData["stop_scores"][0]["apellido"]}
              />
            ) : null}
          </div>
          <div className="col">
            <label>Ciudad</label>
            <input type="text" value={newData["ciudad"]} disabled></input>
            {newData["stop_scores"].length > 0 ? (
              <ScoreSelector
                fieldName="ciudad"
                readOnly={true}
                selectedItem={newData["stop_scores"][0]["ciudad"]}
              />
            ) : null}
          </div>
          <div className="col">
            <label>País</label>
            <input type="text" value={newData["pais"]} disabled></input>
            {newData["stop_scores"].length > 0 ? (
              <ScoreSelector
                fieldName="pais"
                readOnly={true}
                selectedItem={newData["stop_scores"][0]["pais"]}
              />
            ) : null}
          </div>
          <div className="col">
            <label>Animal</label>
            <input type="text" value={newData["animal"]} disabled></input>
            {newData["stop_scores"].length > 0 ? (
              <ScoreSelector
                fieldName="animal"
                readOnly={true}
                selectedItem={newData["stop_scores"][0]["animal"]}
              />
            ) : null}
          </div>
          <div className="col">
            <label>Fruta</label>
            <input type="text" value={newData["fruta"]} disabled></input>
            {newData["stop_scores"].length > 0 ? (
              <ScoreSelector
                fieldName="fruta"
                readOnly={true}
                selectedItem={newData["stop_scores"][0]["fruta"]}
              />
            ) : null}
          </div>
          <div className="col">
            <label>Color</label>
            <input type="text" value={newData["color"]} disabled></input>
            {newData["stop_scores"].length > 0 ? (
              <ScoreSelector
                fieldName="color"
                readOnly={true}
                selectedItem={newData["stop_scores"][0]["color"]}
              />
            ) : null}
          </div>
          <div className="col">
            <label>Cosa</label>
            <input type="text" value={newData["cosa"]} disabled></input>
            {newData["stop_scores"].length > 0 ? (
              <ScoreSelector
                fieldName="cosa"
                readOnly={true}
                selectedItem={newData["stop_scores"][0]["cosa"]}
              />
            ) : null}
          </div>
          <div className="hole hole-top"></div>
          <div className="hole hole-bottom"></div>
        </div>
        <span>
          {newData["stop_scores"].length > 0
            ? total(newData["stop_scores"][0])
            : null}
        </span>
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
              <div className="players-list">
                <h2>Jugando...</h2>
                <ol>
                  {players.map(player => (
                    <li>{player}</li>
                  ))}
                </ol>
              </div>
              <div className="hole hole-top-right"></div>
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
