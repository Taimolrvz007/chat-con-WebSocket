import "./estetica.css";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Personas from "./personas";

const socket = io("http://localhost:3000");

function App() {
  const [mensaje, setMensaje] = useState<string>("");
  const [mensajes, setMensajes] = useState<string[]>([]);

  useEffect(() => {
    socket.on("mensaje", (msg: string) => {
      setMensajes((prev) => [...prev, msg]);
    });
    return () => { socket.off("mensaje"); };
  }, []);

  const enviarMensaje = () => {
    if (mensaje.trim() === "") return;
    socket.emit("mensaje", mensaje);
    setMensaje("");
  };

  return (
    <div className="chat-container">
      <h1 className="chat-title">Chat en Vivo</h1>

      <div className="chat-messages">
        {mensajes.map((msg, index) => (
          <p key={index} className="message">{msg}</p>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && enviarMensaje()}
          placeholder="Escribe un mensaje..."
        />
        <button onClick={enviarMensaje}>Enviar</button>
      </div>

      <Personas onSeleccionarPersona={(persona) => console.log("Persona seleccionada:", persona)} />
    </div>
  );
}

export default App;