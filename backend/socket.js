const { Room, Participant, Question, QuizHistory } = require("./models");

module.exports = io => {
	io.on("connection", (socket) => {
	console.log("New connection:", socket.id);

	socket.on("join-room", ({ roomCode, username }) => {
		socket.join(roomCode);
		console.log(username, roomCode, "odasına katıldı.");

		socket.to(roomCode).emit("user-joined", { username });
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
		},
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
		console.log("Disconnected", socket.id);
	});
	});
}