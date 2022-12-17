const express = require("express");
const app = express();
const { createServer } = require("http");
const { Server } = require("socket.io");
const httpserver = createServer(app);
const cors = require("cors");
const ACTIONS = require("./Actions");
const PORT = 3001;

app.use(express.static("public"));
app.use(express.static("build"));

httpserver.listen(PORT, () => {
    console.log(`Listening to ${PORT} `)
})

const io = new Server(httpserver, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    },
});


const userSocketMap = {};


async function getAllConnectedClients(roomId) {
    const sockets = await io.in(roomId).fetchSockets();
    return sockets.map((currSocket) => {
        return { username: userSocketMap[currSocket.id], socketId: currSocket.id };
    })
}

io.on('connection', (socket) => {
    socket.on(ACTIONS.JOIN, async ({ roomId, username }) => {
        socket.join(roomId);
        userSocketMap[socket.id] = username;
        const clients = await getAllConnectedClients(roomId);
        io.to(roomId).emit(ACTIONS.JOINED, {
            username,
            socketId: socket.id,
            clients
        });
    });

    socket.on("disconnecting", async () => {
        const [socketId, roomId] = Array.from(socket.rooms);
        const clients = await getAllConnectedClients(roomId);
        io.to(roomId).emit(ACTIONS.DISCONNECTED, {
            username: userSocketMap[socketId],
            socketId: socketId,
            clients
        })
        delete userSocketMap[socket.id];
    })

    socket.on(ACTIONS.CODE_CHANGE,({code}) => {
        const [socketId, roomId] = Array.from(socket.rooms);
        socket.to(roomId).emit(ACTIONS.CODE_CHANGE, {
            code
        });
    })

    socket.on(ACTIONS.SYNC_CODE,({code, socketId}) => {
        socket.to(socketId).emit(ACTIONS.CODE_CHANGE,{
            code
        })
    })
})





