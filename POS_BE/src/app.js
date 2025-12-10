// server.js
const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const socket = require("./services/socket.service");
const mainRoute = require("./routes/routes");
const path = require("path");

const app = express();
const server = createServer(app);

// Init socket.io
socket.init(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// =======================================
// API ROUTES
// =======================================
app.use("/api", mainRoute);

// Status server (bukan "/")
app.get("/status", (req, res) => {
  res.status(200).json({
    status: true,
    message: "Server OK",
  });
});

// =======================================
// SERVE REACT BUILD
// =======================================

// Jika build kamu ada di POS_BE/production/
app.use(express.static(path.join(__dirname, "../production")));

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../production", "index.html"));
});

// =======================================
// 404
// =======================================
app.use((req, res) => {
  res.status(404).json({
    status: false,
    message: "Endpoint not found",
  });
});

module.exports = { app, server };
