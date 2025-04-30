// ??? just copy-pasted!

const http = require("http");
const app = require("./app");
const { sequelize } = require("./models");
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Yeni bağlantı:", socket.id);

  socket.on("join-room", ({ roomCode, username }) => {
    socket.join(roomCode);
    io.to(roomCode).emit("user-joined", username);
  });

  socket.on("submit-answer", (data) => {
    // değerlendirme ve puan işlemleri burada yapılabilir
  });
});

(async () => {
  try {
    await sequelize.sync({ alter: true });
    server.listen(process.env.PORT || 3000, () =>
      console.log("Server çalışıyor 🔥"),
    );
  } catch (error) {
    console.error("DB bağlantı hatası:", error);
  }
})();
