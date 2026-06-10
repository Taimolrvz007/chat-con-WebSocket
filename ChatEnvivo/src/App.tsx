import "./estetica.css";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

type Mensaje = {
  texto: string;
  nickname: string;
  id: string;
  tipo?: "sistema";
};

function App() {
  const [nickname, setNickname] = useState("");
  const [nickConfirmado, setNickConfirmado] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [usuariosOnline, setUsuariosOnline] = useState(0);
  const [escribiendo, setEscribiendo] = useState<string | null>(null);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.on("mensaje", (msg: Mensaje) => {
      setMensajes((prev) => [...prev, msg]);
    });

    socket.on("sistema", (texto: string) => {
      setMensajes((prev) => [...prev, { texto, nickname: "", id: "sistema", tipo: "sistema" }]);
    });

    socket.on("usuarios_online", (count: number) => {
      setUsuariosOnline(count);
    });

    socket.on("escribiendo", ({ nickname, isTyping }: { nickname: string; isTyping: boolean }) => {
      setEscribiendo(isTyping ? nickname : null);
    });

    return () => {
      socket.off("mensaje");
      socket.off("sistema");
      socket.off("usuarios_online");
      socket.off("escribiendo");
    };
  }, []);

  // Auto-scroll al último mensaje
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  const registrarNick = () => {
    if (nickname.trim() === "") return;
    socket.emit("registrar", nickname.trim());
    setNickConfirmado(true);
  };

  const enviarMensaje = () => {
    if (mensaje.trim() === "") return;
    socket.emit("mensaje", mensaje);
    socket.emit("escribiendo", false);
    setMensaje("");
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMensaje(e.target.value);
    socket.emit("escribiendo", true);
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("escribiendo", false);
    }, 1500);
  };

  // Pantalla de nickname
  if (!nickConfirmado) {
    return (
      <div className="chat-container">
        <h1 className="chat-title">Chat en Vivo</h1>
        <div className="nick-screen">
          <p className="nick-label">Elige tu nombre para entrar</p>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && registrarNick()}
            placeholder="Tu nickname..."
            className="nick-input"
          />
          <button onClick={registrarNick} className="nick-btn">Entrar al chat</button>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1 className="chat-title">Chat en Vivo</h1>
        <span className="online-badge">🟢 {usuariosOnline} online</span>
      </div>

      <div className="chat-messages">
        {mensajes.map((msg, i) =>
          msg.tipo === "sistema" ? (
            <p key={i} className="message-sistema">{msg.texto}</p>
          ) : (
            <div
              key={i}
              className={`message ${msg.id === socket.id ? "message-own" : ""}`}
            >
              <span className="message-nick">{msg.nickname}</span>
              <span>{msg.texto}</span>
            </div>
          )
        )}
        <div ref={bottomRef} />
      </div>

      <div className="typing-indicator">
        {escribiendo ? `${escribiendo} está escribiendo...` : "\u00A0"}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={mensaje}
          onChange={handleTyping}
          onKeyDown={(e) => e.key === "Enter" && enviarMensaje()}
          placeholder="Escribe un mensaje..."
        />
        <button onClick={enviarMensaje}>Enviar</button>
      </div>
    </div>
  );
}

export default App;