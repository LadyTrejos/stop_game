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

const useStopForm = (initialValues, callback = () => {}) => {
  const [inputs, setInputs] = useState(initialValues);
  const [insertGame] = useMutation(INSERT_STOP);

  const handleSubmit = (event, values, disableButton) => {
    if (event) event.preventDefault();

    let empty = false;
    let viewValues = Object.entries(values);
    let message = null;

    viewValues.map(item => {
      if (typeof item[1] !== "number") {
        if (item[1].trim() === "") {
          empty = true;
        }
      }
    });

    if (empty) {
      message = "faltan por llenar algunos campos";
    } else {
      disableButton();
      insertGame({
        variables: {
          animal: viewValues[4][1],
          apellido: viewValues[1][1],
          ciudad: viewValues[2][1],
          color: viewValues[6][1],
          cosa: viewValues[7][1],
          fruta: viewValues[5][1],
          nombre: viewValues[0][1],
          pais: viewValues[3][1],
          player_id: viewValues[9][1],
          game_id: viewValues[8][1]
        }
      });
    }

    callback({ err: message });
  };

  const handleInputChange = event => {
    event.persist();
    setInputs(inputs => ({
      ...inputs,
      [event.target.name]: event.target.value
    }));
  };

  return {
    handleSubmit,
    handleInputChange,
    inputs
  };
};

export default useStopForm;
