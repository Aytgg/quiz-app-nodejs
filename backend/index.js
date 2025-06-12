const http = require("http");
const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const sequelize = require("./db");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const roomRoutes = require("./routes/roomRoutes");
const quizRoutes = require("./routes/quizRoutes");
const quizHistoryRoutes = require("./routes/quizHistoryRoutes");

const initializeSocket = require("./socket");

const app = express();
app.use(cors({ origin: "*" }));
app.use(require("./passport").initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/quiz-history", quizHistoryRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

initializeSocket(io);

sequelize.sync({ alter: true }).then(() => {
  server.listen(process.env.PORT, () => {
    console.log("Server is running on port: " + process.env.PORT);
  });
});

// 404 Middleware
app.use((req, res, next) => {
  var err = new Error("Sayfa Bulunamadı!");
  err.status = 404;
  next(err);
});

module.exports = app;
