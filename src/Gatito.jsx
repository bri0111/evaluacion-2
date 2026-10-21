
import { useState } from "react";
import "./Gatito.css";

export default function Gatito() {
  const [mensaje, setMensaje] = useState(false);
  const [maullido, setMaullido] = useState("Nyaa~ ♡");

  function acariciar() {
    const frases = [
      "Nyaa~ ♡",
      "Miau miau~ 🖤",
      "¡Nyaaa! ✨",
      "Prrr... ♡",
      "¿Buscas ropita? ฅ^•ﻌ•^ฅ",
    ];

    setMaullido(frases[Math.floor(Math.random() * frases.length)]);
    setMensaje(true);
  }

  return (
    <div className="mascota-gato">
      {mensaje && (
        <div className="gato-burbuja" key={maullido}>
          <span className="gato-texto">{maullido}</span>
          <span className="gato-subtexto">
            Bienvenida a NOSTALGIA
          </span>
        </div>
      )}

      <button
        className="gato-boton"
        onClick={acariciar}
        aria-label="Acariciar al gatito"
        title="¡Hazme clic!"
      >
       

        <img
          className="gato-imagen"
          src="/Gatito-nostalgia.png"
          alt="Gatito negro mágico de ojos celestes"
          draggable="false"
        />

        <span className="gato-pista">♡ acaríciame ♡</span>
      </button>
    </div>
  );
}
