const http = require("http");
const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const sequelize = require("./db");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const roomRoutes = require("./routes/roomRoutes");

const app = express();
//app.use(cors({ origin: "https://localhost:3000" }));
//app.use(require("passport").initialize());
//app.use(express.json());
//app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("New connection:", socket.id);

  socket.on("join-room", ({ roomCode, username }) => {
    socket.join(roomCode);
    console.log(username, roomCode, "odasına katıldı.");

    socket.to(roomCode).emit("user-joined", { username });
  });
  socket.on("submit-answer", (data) => {
    io.to(data.roomCode).emit("answer-submitted", data);
  });
  socket.on("disconnect", () => {
    console.log("Disconnected", socket.id);
  });
});

sequelize.sync({ alter: true }).then(() => {
  server.listen(process.env.PORT, () => {
    console.log("Server is running on port: " + process.env.PORT);
  });
});

// Homepage route
app.get("/", (req, res) => {
  res.send(`
	<a href="/login"> Login </a>
	<br>
	<a href="/register"> Register </a>`);
});

// Login route GET
app.get("/login", (req, res) => {
  return res.redirect("localhost:3000/login");
});

// Register route GET
app.get("/register", (req, res) => {
  return redirect("localhost:3000/register");
});

// Profile route GET
app.get(
  "/profile",
  /*checkAuth,*/ (req, res) => {
    res.send(`<a href="/logout"> Logout </a>`);
  },
);

// Logout route DELETE
app.delete("/logout", (req, res) => {
  req.logOut(); // Only on session usages !!!
  res.redirect("/");
});

// 404 Middleware
app.use((req, res, next) => {
  var err = new Error("Sayfa Bulunamadı!");
  err.status = 404;
  next(err);
});

module.exports = app;
