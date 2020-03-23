import React from "react";

export default function MyCard({ currentPlayer, game }) {
  return (
    <div>
      <div class="flip-card table">
        <div class="flip-card-inner">
          <div class="flip-card-front">
            <div className="card">
              Jugando...<div className="hole hole-top-right"></div>
              <div className="hole hole-middle-right"></div>
              <div className="hole hole-bottom-right"></div>
            </div>
          </div>
          <div class="flip-card-back">
            <div className="card">
              <div className="row">
                <label className="cell">Nombre</label>
                <label className="cell">Apellido</label>
                <label className="cell">Ciudad</label>
                <label className="cell">País</label>
              </div>
              <div className="row">
                <div className="cell">
                  <input id="nombre" type="text"></input>
                </div>
                <div className="cell">
                  <input id="apellido" type="text"></input>
                </div>
                <div className="cell">
                  <input id="ciudad" type="text"></input>
                </div>
                <div className="cell">
                  <input id="pais" type="text"></input>
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
                  <input id="animal" type="text"></input>
                </div>
                <div className="cell">
                  <input id="fruta" type="text"></input>
                </div>
                <div className="cell">
                  <input id="color" type="text"></input>
                </div>
                <div className="cell">
                  <input id="cosa" type="text"></input>
                </div>
              </div>
              <div className="hole hole-top"></div>
              <div className="hole hole-middle"></div>
              <div className="hole hole-bottom"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
