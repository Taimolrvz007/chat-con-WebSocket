const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Crear tabla si no existe
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS mensajes (
      id SERIAL PRIMARY KEY,
      nickname TEXT NOT NULL,
      texto TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log("DB lista");
}
initDB();

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

const usuarios = new Map();

io.on("connection", async (socket) => {

  // Enviar historial al nuevo usuario
  const { rows } = await pool.query(
    "SELECT * FROM mensajes ORDER BY created_at ASC LIMIT 50"
  );
  socket.emit("historial", rows);

  socket.on("registrar", (nickname) => {
    usuarios.set(socket.id, nickname);
    io.emit("usuarios_online", usuarios.size);
    io.emit("sistema", `${nickname} se unió al chat`);
  });

  socket.on("mensaje", async (texto) => {
    const nickname = usuarios.get(socket.id) || "Anónimo";
    // Guardar en DB
    await pool.query(
      "INSERT INTO mensajes (nickname, texto) VALUES ($1, $2)",
      [nickname, texto]
    );
    io.emit("mensaje", { texto, nickname, id: socket.id });
  });

  socket.on("escribiendo", (isTyping) => {
    const nickname = usuarios.get(socket.id);
    if (nickname) socket.broadcast.emit("escribiendo", { nickname, isTyping });
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

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));