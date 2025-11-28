let io;

function init(server) {
  io = require("socket.io")(server, {
    cors: {
      origin: "*",
      method: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    },
  });
  io.on("connection", (socket) => {
    console.log("🔌 WebSocket client connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("❌ WebSocket client disconnected:", socket.id);
    });
  });

  return io;
}

function getIo() {
  if (!io) console.log("Connected Websocket is not initialized");
  return io;
}

function emit(event, payload) {
  if (!io) {
    console.error("❗ WebSocket is not initialized. Call init(server) first.");
    throw new Error("WebSocket is not initialized.");
  }
  io.emit(event, payload);
}

module.exports = { init, getIo, emit };
