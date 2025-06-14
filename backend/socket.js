const { Room, Participant, Question, QuizHistory } = require("./models");

const rooms = {}; // [roomCode: [users] ]
const answers = {}; // [roomCode: { questionOrder: [{ asnwer }] } ]

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
    socket.on("start-quiz", async ({ roomCode, users }) => {
      try {
        const room = await Room.findOne({ where: { code: roomCode } });
        if (!room) return socket.emit("start-error", { message: "Oda bulunamadı." });

        for (var u of users) {
          let participant = await Participant.findOne({
            where: { roomId: room.id, username: u },
          });
          if (!participant)
            participant = await Participant.create({
              roomId: room.id,
              username: u,
            });
        };
        
        room.status = "in-progress";
        await room.save();

        io.to(roomCode).emit("quiz-started");
      } catch (err) {
        console.error(err);
        socket.emit("start-error", { message: "Quiz başlatılamadı." });
      }
    });
    socket.on(
      "submit-answer",
      async ({ roomCode, username, question, answer }) => {
        try {
          const room = await Room.findOne({ where: { code: roomCode } });
          if (!room) return socket.emit("answer-error", { message: "Oda bulunamadı." });

          let participant = await Participant.findOne({
            where: { roomId: room.id, username },
          });
          if (!participant) return socket.emit("answer-error", { message: "Katılımcı bulunamadı." });

          if (!question) return socket.emit("answer-error", { message: "Soru bulunamadı." });

          const isCorrect = answer == question.answer;

          if (!answers[roomCode]) answers[roomCode] = {};
          if (!answers[roomCode][question.order]) answers[roomCode][question.order] = { correct: [], wrong: [] };

          if (
            answers[roomCode][question.order].correct.includes(username) ||
            answers[roomCode][question.order].wrong.includes(username)
          )
            return socket.emit("answer-error", { message: "Bu soruya zaten cevap verdiniz." });
        
          if (isCorrect) {
            answers[roomCode][question.order].correct.push(username);
            if (answers[roomCode][question.order].correct[0] == username)
              // First correct answer 100+20p
              participant.score += 120;
            else if (answers[roomCode][question.order].correct[1] == username)
              // Second correct answer 100+10p
              participant.score += 110;
            else
              // Other correct answers 100p
              participant.score += 100;
            participant.correctAnswers += 1;
          } else {
            answers[roomCode][question.order].wrong.push(username);
            participant.score -= 50;
          }

          await participant.save();

          socket.emit("answer-result", {
            question,
            answers: answers[roomCode][question.order],
          });
        } catch (err) {
          socket.emit("answer-error", { message: "Cevap kaydedilemedi." });
        }
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
    socket.on("end-quiz", async ({ code }) => {
      let room = await Room.findOne({ where: { code } });
      if (!room) return;
      if (room.status == "finished") return;
      const isExist = await QuizHistory.findOne({
        where: { roomId: room.id },
      });
      if (isExist) return;
      
      room.status = "finished";
      await room.save();

      let participants = await Participant.findAll({
        where: { roomId: room.id },
        order: [["score", "DESC"]],
      });

      let totalQuestions = await Question.count({
        where: { quizId: room.quizId },
      });

      var qh = await QuizHistory.create({
        userId: room.hostId,
        roomId: room.id,
        results: participants.map((p) => ({
          username: p.username,
          score: p.score,
          correctAnswers: p.correctAnswers,
        })),
        totalQuestions,
      });
      const relatedRoom = await qh.getRoom();
      const relatedQuiz = await relatedRoom.getQuiz();
      const relatedQuestionCount = await relatedQuiz.countQuestions();
      const relatedParticipants = await relatedRoom.getParticipants();

      io.to(code).emit("game-ended", {
        participants,
        quizTitle: relatedQuiz.title,
        totalQuestions: relatedQuestionCount,
        participants: relatedParticipants,
      });
    });
    socket.on("disconnect", () => {
      const { roomCode, username } = socket;
      // User left the room
      if (roomCode && username && rooms[roomCode])
        io.to(roomCode).emit("user-list", {
          users: rooms[roomCode].filter((user) => user != username),
        });
      // Delete room if nobody left
      if (roomCode && rooms[roomCode] && rooms[roomCode].length == 0)
        delete rooms[roomCode];
    });
  });
};
