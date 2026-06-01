const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173"
    }
});

io.on("connection", (socket) => {
    console.log("Usuario conectado");

    socket.on("mensaje", (mensaje) => {
        io.emit("mensaje", mensaje);
    });

    socket.on("disconnect", () => {
        console.log("Usuario desconectado");
    });
});

server.listen(3000, () => {
    console.log("Servidor en puerto 3000");
});