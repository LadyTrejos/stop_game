import React, { useState, useEffect, useRef } from "react";
import { useSubscription, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import MyCard from "./MyCard";
import OpponentCard from "./OpponentCard";
import PlayersModal from "./PlayersModal";
import "./App.scss";
import Footer from "./Footer";

const INSERT_GAME = gql`
  mutation InsertGame($letter: String!, $number_of_players: Int!) {
    insert_games(
      objects: { letter: $letter, number_of_players: $number_of_players }
    ) {
      returning {
        id
        letter
        number_of_players
      }
    }
  }
`;

const GET_LAST_GAME = gql`
  subscription GetlastGame {
    games(limit: 1, order_by: { id: desc }) {
      id
      letter
      number_of_players
    }
  }
`;

function App() {
  const [gameID, setGameID] = useState(null);
  const [gameLetter, setGameLetter] = useState(null);
  const [playerID, setPlayerID] = useState(null);
  const [playerName, setPlayerName] = useState(null);
  const [temporalGameId, setTemporalGameId] = useState(null);
  const [active, setActive] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [numberOfPlayers, setNumberOfPlayers] = useState(null);
  let tempNumOfPlayers = null;

  const [InsertGame] = useMutation(INSERT_GAME);
  const { loading, data } = useSubscription(GET_LAST_GAME);

  const prevGameIdRef = useRef();
  const prevGameId = prevGameIdRef.current;

  useEffect(() => {
    if (!loading) {
      prevGameIdRef.current = data.games[0].id;
    }
  });

  if (!loading) {
    // Should activate game ?
    // If useEffect() detects a change on DB, activates a game
    if (temporalGameId !== prevGameId) {
      setTemporalGameId(prevGameId);
    }
    if (typeof temporalGameId == "number" && !active) {
      setGameID(data.games[0].id);
      setGameLetter(data.games[0].letter);
      setNumberOfPlayers(data.games[0].number_of_players);
      setActive(true);
      showModal();
    }
  }

  function chooseLetter(length = 1) {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVYZ";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  function newGame() {
    const pattern = RegExp("^[2-9]{1}$");

    if (pattern.test(tempNumOfPlayers)) {
      InsertGame({
        variables: {
          letter: chooseLetter(),
          number_of_players: tempNumOfPlayers
        }
      }).then(res => {
        // Create a new game
        setGameID(res.data.insert_games.returning[0].id);
        setGameLetter(res.data.insert_games.returning[0].letter);
        setNumberOfPlayers(
          res.data.insert_games.returning[0].number_of_players
        );
      });

      setActive(true);
      showModal();
    } else {
      alert("Cantidad mínima de jugadores: 2. Máximo: 9");
    }
  }

  function showModal() {
    setVisibleModal(true);
  }

  function closeModal() {
    setVisibleModal(false);
  }

  function getPlayerInfo(id, name) {
    setPlayerID(id);
    setPlayerName(name);
  }

  function onChange(e) {
    const pattern = RegExp("^[2-9]{1}$");
    if (e.target.value.length > 1) {
      e.target.value = e.target.value.slice(0, 1);
    }

    if (pattern.test(e.target.value)) {
      tempNumOfPlayers = e.target.value;
    } else {
      e.target.value = null;
      tempNumOfPlayers = null;
    }
  }

  return (
    <div>
      {active ? (
        <React.Fragment>
          {visibleModal ? (
            <PlayersModal
              visible={visibleModal}
              closeModal={closeModal}
              getPlayerInfo={getPlayerInfo}
              gameID={gameID}
              numberOfPlayers={numberOfPlayers}
            />
          ) : (
            <React.Fragment>
              <MyCard
                currentPlayer={playerID}
                currentPlayerName={playerName}
                game={gameID}
                gameLetter={gameLetter}
                numberOfPlayers={numberOfPlayers}
              />
              <OpponentCard currentPlayer={playerID} game={gameID} />
            </React.Fragment>
          )}
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div className="stop-title">Stop!</div>
          <div className="start-game">
            <label>Cantidad de jugadores: </label>
            <input
              type="number"
              onChange={e => onChange(e)}
              max={9}
              min={2}
            ></input>
          </div>

          <button onClick={() => newGame()} className="new-game">
            Nueva partida
          </button>
          <Footer />
        </React.Fragment>
      )}
    </div>
  );
}

export default App;
