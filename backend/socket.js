const { Room, Participant, Question, QuizHistory } = require("./models");

const rooms = {};

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("New connection:", socket.id);

    socket.on("join-room", ({ roomCode, username }) => {
      socket.join(roomCode);
      if (!rooms[roomCode]) rooms[roomCode] = [];
      if (!rooms[roomCode].includes(username)) rooms[roomCode].push(username);

      socket.roomCode = roomCode;
      socket.username = username;
      io.to(roomCode).emit("user-list", { users: rooms[roomCode] });
    });
    socket.on(
      "submit-answer",
      async ({ roomCode, username, selectedOption, correctOption }) => {
        let isCorrect = selectedOption == correctOption;
        let room = await Room.findOne({ where: { code: roomCode } });
        if (!room) return;

        let participant = await Participant.findOne({
          where: { roomId: room.id, username },
        });

        if (isCorrect && participant) {
          participant.score += 100;
          await participant.save();
        }

        io.to(roomCode).emit("answer-result", {
          username,
          correct: isCorrect,
        });
      }
    );
    socket.on("request-scoreboard", async ({ roomCode }) => {
      let room = await Room.findOne({ where: { code: roomCode } });
      if (!room) return;

      let participants = await Participant.findAll({
        where: { roomId: room.id },
        order: [["score", "DESC"]],
      });

      let scoreboard = participants.map((p) => ({
        username: p.username,
        score: p.score,
      }));

      io.to(roomCode).emit("scoreboard", scoreboard);
    });
    socket.on("next-question", ({ roomCode, question }) => {
      io.to(roomCode).emit("new-question", question);

      let timer = 20;
      let interval = setInterval(() => {
        timer--;
        io.to(roomCode).emit("timer", timer);

        if (timer < 1) {
          clearInterval(interval);
          io.to(roomCode).emit("question-ended");
        }
      }, 1000);
    });
    socket.on("end-game", async ({ roomCode }) => {
      let room = await Room.findOne({ where: { code: roomCode } });
      if (!room) return;

      room.status = "finished";
      await room.save();

      let participants = await Participants.findAll({
        where: { roomId: room.id },
        order: [["score", "DESC"]],
      });

      let results = participants.map((p) => ({
        username: p.username,
        score: p.score,
      }));

      let totalQuestions = await Question.count({
        where: { roomId: room.id },
      });

      await QuizHistory.create({
        userId: room.userId,
        totalQuestions,
        results,
      });

      io.to(roomCode).emit("game-ended", results);
    });
    socket.on("disconnect", () => {
      const { roomCode, username } = socket;
      if (roomCode && username && rooms[roomCode])
        io.to(roomCode).emit("user-list", {
          users: rooms[roomCode].filter((user) => user != username),
        });
      console.log("Disconnected", socket.id);
    });
  });
};
