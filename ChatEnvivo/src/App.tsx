import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

function App() {
  const [mensaje, setMensaje] = useState<string>("");
  const [mensajes, setMensajes] = useState<string[]>([]);

  useEffect(() => {
    socket.on("mensaje", (msg: string) => {
      setMensajes((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("mensaje");
    };
  }, []);

  const enviarMensaje = () => {
    if (mensaje.trim() === "") return;

    socket.emit("mensaje", mensaje);
    setMensaje("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Chat en Vivo</h1>

      <div
        style={{
          border: "1px solid gray",
          padding: "10px",
          minHeight: "200px",
          marginBottom: "10px",
        }}
      >
        {mensajes.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>

      <input
        type="text"
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
        placeholder="Escribe un mensaje..."
      />

      <button onClick={enviarMensaje}>
        Enviar
      </button>
    </div>
  );
}

export default App;