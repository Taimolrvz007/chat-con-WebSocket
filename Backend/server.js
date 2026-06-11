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
    const result = await pool.query(
      "INSERT INTO mensajes (nickname, texto) VALUES ($1, $2) RETURNING *",
      [nickname, texto]
    );
    const row = result.rows[0];
    io.emit("mensaje", {
      texto,
      nickname,
      id: socket.id,
      dbId: row.id,
      created_at: row.created_at
    });
  });

  socket.on("borrar_mensaje", async (dbId) => {
    const nickname = usuarios.get(socket.id);
    await pool.query(
      "DELETE FROM mensajes WHERE id = $1 AND nickname = $2",
      [dbId, nickname]
    );
    io.emit("mensaje_borrado", dbId);
  });

  socket.on("reaccion", ({ mensajeId, emoji }) => {
    io.emit("reaccion", { mensajeId, emoji });
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