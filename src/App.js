import React, { useState, useEffect, useRef } from "react";
import { useSubscription, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import MyCard from "./MyCard";
import OpponentCard from "./OpponentCard";
import PlayersModal from "./PlayersModal";
import "./App.scss";

const INSERT_GAME = gql`
  mutation InsertGame($letter: String!) {
    insert_games(objects: { letter: $letter }) {
      returning {
        id
        letter
      }
    }
  }
`;

const GET_LAST_GAME = gql`
  subscription GetlastGame {
    games(limit: 1, order_by: { id: desc }) {
      id
      letter
    }
  }
`;

function App() {
  const [gameID, setGameID] = useState(null);
  const [gameLetter, setGameLetter] = useState(null);
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
    if (temporalGameId !== prevGameId) {
      setTemporalGameId(prevGameId);
    }
    if (typeof temporalGameId == "number" && !active) {
      setGameID(data.games[0].id);
      setActive(true);
      showModal();
    }
  }

  function makeid(length = 1) {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  function newGame() {
    InsertGame({ variables: { letter: makeid() } }).then(res => {
      console.log(res);
      setGameID(res.data.insert_games.returning[0].id);
      setGameLetter(res.data.insert_games.returning[0].letter);
    });

    setActive(true);
    showModal();
  }

  function showModal() {
    setVisibleModal(true);
  }

  function closeModal() {
    setVisibleModal(false);
  }

  function getPlayerID(id) {
    setPlayerID(id);
  }
  return (
    <div>
      {active ? (
        <React.Fragment>
          {visibleModal ? (
            <PlayersModal
              visible={visibleModal}
              closeModal={closeModal}
              getPlayerID={getPlayerID}
            />
          ) : (
            <React.Fragment>
              <MyCard
                currentPlayer={playerID}
                game={gameID}
                gameLetter={gameLetter}
              />
              <OpponentCard currentPlayer={playerID} game={gameID} />
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
