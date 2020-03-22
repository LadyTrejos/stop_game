import React from "react";
import useStopForm from "./lib/CustomHooks";

export default function MyCard({ currentPlayer, game }) {
  const { inputs, handleInputChange, handleSubmit } = useStopForm({
    nombre: "",
    apellido: "",
    ciudad: "",
    pais: "",
    animal: "",
    fruta: "",
    color: "",
    cosa: ""
  });

  return (
    <React.Fragment>
      <form className="table" onSubmit={e => handleSubmit(e, inputs)}>
        <div className="card">
          <div className="row">
            <label className="cell">Nombre</label>
            <label className="cell">Apellido</label>
            <label className="cell">Ciudad</label>
            <label className="cell">País</label>
          </div>
          <div className="row">
            <div className="cell">
              <input
                name="nombre"
                type="text"
                onChange={handleInputChange}
                value={inputs.nombre}
              />
            </div>
            <div className="cell">
              <input
                name="apellido"
                type="text"
                onChange={handleInputChange}
                value={inputs.apellido}
              />
            </div>
            <div className="cell">
              <input
                name="ciudad"
                type="text"
                onChange={handleInputChange}
                value={inputs.ciudad}
              />
            </div>
            <div className="cell">
              <input
                name="pais"
                type="text"
                onChange={handleInputChange}
                value={inputs.pais}
              />
            </div>
          </div>
          <br />
          <div className="row">
            <label className="cell">Animal</label>
            <label className="cell">Fruta</label>
            <label className="cell">Color</label>
            <label className="cell">Cosa</label>
          </div>
          <div className="row">
            <div className="cell">
              <input
                name="animal"
                type="text"
                onChange={handleInputChange}
                value={inputs.animal}
              />
            </div>
            <div className="cell">
              <input
                name="fruta"
                type="text"
                onChange={handleInputChange}
                value={inputs.fruta}
              />
            </div>
            <div className="cell">
              <input
                name="color"
                type="text"
                onChange={handleInputChange}
                value={inputs.color}
              />
            </div>
            <div className="cell">
              <input
                name="cosa"
                type="text"
                onChange={handleInputChange}
                value={inputs.cosa}
              />
            </div>
          </div>
          <div className="hole hole-top"></div>
          <div className="hole hole-middle"></div>
          <div className="hole hole-bottom"></div>
        </div>
        <button type="submit" className="stop-button">
          Stop
        </button>
      </form>
    </React.Fragment>
  );
}
