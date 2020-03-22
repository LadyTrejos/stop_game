import { useState } from "react";

const useStopForm = (initialValues, callback = () => {}) => {
  const [inputs, setInputs] = useState(initialValues);

  const handleSubmit = (event, values) => {
    console.log(values);
    if (event) event.preventDefault();
    callback();
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
