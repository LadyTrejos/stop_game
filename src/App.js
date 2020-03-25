import React, { useState, useEffect, useRef } from "react";
import { useSubscription, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import MyCard from "./MyCard";
import OpponentCard from "./OpponentCard";
import PlayersModal from "./PlayersModal";
import "./App.scss";

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
  const [temporalGameId, setTemporalGameId] = useState(null);
  const [active, setActive] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [numberOfPlayers, setNumberOfPlayers] = useState(null);
  let numOfPlayers = 2;

  const [InsertGame] = useMutation(INSERT_GAME);
  const { loading, error, data } = useSubscription(GET_LAST_GAME);

  const prevGameIdRef = useRef();

  useEffect(() => {
    if (!loading) {
      prevGameIdRef.current = data.games[0].id;
    }
  });

  const prevGameId = prevGameIdRef.current;

  if (!loading) {
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

  function makeid(length = 1) {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVYZ";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  function newGame() {
    console.log("number of players: ", numberOfPlayers);
    const pattern = RegExp("^[2-9]{1}$");

    if (pattern.test(numOfPlayers)) {
      console.log("correcto");

      InsertGame({
        variables: { letter: makeid(), number_of_players: numOfPlayers }
      }).then(res => {
        console.log(res);
        setGameID(res.data.insert_games.returning[0].id);
        setGameLetter(res.data.insert_games.returning[0].letter);
        setNumberOfPlayers(
          res.data.insert_games.returning[0].number_of_players
        );
      });

      setActive(true);
      showModal();
    } else {
      console.log("incorrecto");
      alert("Ingresa solo un número de un dígito mayor o igual a 2");
    }
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

  function onChange(e) {
    const pattern = RegExp("^[2-9]{1}$");
    if (e.target.value.length > 1) {
      e.target.value.slice(0, 1);
    }

    if (pattern.test(e.target.value)) {
      numOfPlayers = e.target.value;
      console.log("cumplió ", numOfPlayers);
    }

    console.log("numOfPlayers: ", numOfPlayers);
  }

  console.log("game_id app: ", gameID);
  return (
    <div>
      {active ? (
        <React.Fragment>
          {visibleModal ? (
            <PlayersModal
              visible={visibleModal}
              closeModal={closeModal}
              getPlayerID={getPlayerID}
              gameID={gameID}
              numberOfPlayers={numberOfPlayers}
            />
          ) : (
            <React.Fragment>
              <MyCard
                currentPlayer={playerID}
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
          <div style={{ paddingBottom: "30px" }}>
            <label>Cantidad de jugadores: </label>
            <input
              type="number"
              onChange={e => onChange(e)}
              style={{ height: "30px", width: "30px", fontSize: "20px" }}
              max={9}
              min={2}
            ></input>
          </div>

          <button onClick={() => newGame()} className="new-game">
            Nueva partida
          </button>
          <div style={{ color: "#f00" }}>
            {errorMessage ? errorMessage : null}
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

export default App;
