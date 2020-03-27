import { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

const INSERT_STOP = gql`
  mutation InsertStop(
    $animal: String!
    $apellido: String!
    $ciudad: String!
    $color: String!
    $cosa: String!
    $fruta: String!
    $nombre: String!
    $pais: String!
    $player_id: Int!
    $game_id: Int!
  ) {
    insert_stop(
      objects: {
        animal: $animal
        apellido: $apellido
        ciudad: $ciudad
        color: $color
        cosa: $cosa
        fruta: $fruta
        nombre: $nombre
        pais: $pais
        player_id: $player_id
        game_id: $game_id
      }
    ) {
      returning {
        id
      }
    }
  }
`;

const INSERT_SCORE = gql`
  mutation InsertScore(
    $animal: Int!
    $apellido: Int!
    $ciudad: Int!
    $color: Int!
    $cosa: Int!
    $fruta: Int!
    $nombre: Int!
    $pais: Int!
    $stop_id: Int!
  ) {
    insert_stop_scores(
      objects: {
        animal: $animal
        apellido: $apellido
        ciudad: $ciudad
        color: $color
        cosa: $cosa
        fruta: $fruta
        nombre: $nombre
        pais: $pais
        stop_id: $stop_id
      }
    ) {
      returning {
        id
      }
    }
  }
`;

const useStopForm = (
  initialValues,
  initialScoreValues,
  callback = () => {}
) => {
  const [inputs, setInputs] = useState(initialValues);
  const [stopId, setStopId] = useState(null);

  const [scoreInputs, setScoreInputs] = useState(initialScoreValues);
  const [insertGame] = useMutation(INSERT_STOP);
  const [insertScore] = useMutation(INSERT_SCORE);

  function getStopId(id) {
    setStopId(id);
  }

  const handleSubmit = (event, values, disableButton) => {
    if (event) event.preventDefault();

    let empty = false;

    for (const key in values) {
      if (typeof values[key] !== "number") {
        if (values[key].trim() === "") {
          empty = true;
        }
      }
    }

    if (empty) {
      alert("Debes llenar todos los campos.");
    } else {
      disableButton();
      insertGame({
        variables: values
      }).then(res => {
        setStopId(res.data.insert_stop.returning[0].id);
      });
    }
    callback();
  };

  const handleSubmitScore = (event, values, showTotal) => {
    if (event) event.preventDefault();
    let empty = false;

    values["stop_id"] = stopId;
    console.log("values en el handle, ", values);

    for (const key in values) {
      if (values[key] === null) {
        empty = true;
      }
    }

    if (empty) {
      alert("Aún no has puntuado todas tus respuestas");
    } else {
      showTotal();
      insertScore({
        variables: values
      });
    }
  };

  const handleInputChange = event => {
    event.persist();
    setInputs(inputs => ({
      ...inputs,
      [event.target.name]: event.target.value
    }));
  };

  const handleInputScoreChange = (fieldName, value) => {
    console.log("en el handle: ", fieldName, value);
    setScoreInputs(scoreInputs => ({
      ...scoreInputs,
      [fieldName]: value
    }));
  };

  return {
    getStopId,
    handleSubmit,
    handleSubmitScore,
    handleInputScoreChange,
    handleInputChange,
    inputs,
    scoreInputs
  };
};

export default useStopForm;
