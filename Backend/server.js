const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173" }
});

// Map de socket.id -> nickname
const usuarios = new Map();

io.on("connection", (socket) => {

  // 1. Registro de nickname
  socket.on("registrar", (nickname) => {
    usuarios.set(socket.id, nickname);
    // Avisar a todos cuántos hay
    io.emit("usuarios_online", usuarios.size);
    io.emit("sistema", `${nickname} se unió al chat`);
  });

  // 2. Mensaje con nombre incluido
  socket.on("mensaje", (texto) => {
    const nickname = usuarios.get(socket.id) || "Anónimo";
    io.emit("mensaje", { texto, nickname, id: socket.id });
  });

  // 3. Typing indicator
  socket.on("escribiendo", (isTyping) => {
    const nickname = usuarios.get(socket.id);
    if (nickname) {
      socket.broadcast.emit("escribiendo", { nickname, isTyping });
    }
  });

  socket.on("disconnect", () => {
    const nickname = usuarios.get(socket.id);
    if (nickname) {
      io.emit("sistema", `${nickname} salió del chat`);
      io.emit("usuarios_online", usuarios.size - 1);
    }
    usuarios.delete(socket.id);
  });
});

server.listen(3000, () => console.log("Servidor en puerto 3000"));