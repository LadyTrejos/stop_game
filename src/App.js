import React, { useState, useEffect, useRef } from "react";
import { useSubscription, useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import MyCard from "./MyCard";
import OpponentCard from "./OpponentCard";
import PlayersModal from "./PlayersModal";
import "./App.scss";

const INSERT_GAME = gql`
  mutation InsertGame {
    insert_games(objects: {}) {
      returning {
        id
      }
    }
  }
`;

const GET_LAST_GAME = gql`
  subscription GetlastGame {
    games(limit: 1, order_by: { id: desc }) {
      id
    }
  }
`;

function App() {
  const [gameID, setGameID] = useState(null);
  const [playerID, setPlayerID] = useState(null);
  const [temporalGameId, setTemporalGameId] = useState(null);
  const [active, setActive] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [InsertGame] = useMutation(INSERT_GAME);
  const { loading, error, data } = useSubscription(GET_LAST_GAME);

  const prevGameIdRef = useRef();

  useEffect(() => {
    if (!loading) {
      prevGameIdRef.current = data.games[0].id;
    }
  });

  const prevGameId = prevGameIdRef.current;

  if (loading) {
    console.log("cargando");
  } else {
    if (temporalGameId != prevGameId) {
      setTemporalGameId(prevGameId);
      setGameID(data.games[0].id);
      setActive(true);
    }
  }

  function newGame() {
    InsertGame().then(res => {
      setGameID(res.data.insert_games.returning[0].id);
    });

    setActive(true);
    showModal();
    console.log("nueva partida: ");
  }

  function showModal() {
    setVisibleModal(true);
  }

  function closeModal() {
    setVisibleModal(false);
  }
  return (
    <div>
      {active ? (
        <React.Fragment>
          {visibleModal ? (
            <PlayersModal visible={visibleModal} closeModal={closeModal} />
          ) : (
            <React.Fragment>
              <MyCard currentPlayer={1} game={1} />
              <OpponentCard />
            </React.Fragment>
          )}
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div className="stop-title">Stop!</div>
          <button onClick={() => newGame()} className="new-game">
            Nueva partida
          </button>
        </React.Fragment>
      )}
    </div>
  );
}

export default App;
