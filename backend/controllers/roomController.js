const { Room, Question } = require("../models");
const generateRoomCode = require("../utils/generateRoomCode");

exports.create = async (req, res) => {
  try {
    let code, existingRoom;
    do {
      code = generateRoomCode();
      existingRoom = await Room.findOne({ where: { code } });
    } while (existingRoom);

    const { quiz } = req.body;
    const room = await Room.create({
      code,
      title: quiz.title || "Yeni Oda",
      status: "waiting",
      hostId: req.user.id,
      quizId: quiz.id,
    });

    res.status(201).json({ roomCode: room.code });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Oda oluşturulamadı" });
  }
};

exports.check = async (req, res) => {
  const { roomCode } = req.body;

  try {
    const room = await Room.findOne({
      where: {
        code: roomCode,
      },
    });

    if (!room) return res.status(404).json({ message: "Oda bulunamadı" });

    res.json({ id: room.id, hostId: room.hostId, status: room.status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Oda kontrol edilemedi" });
  }
};

exports.questions = async (req, res) => {
  try {
    const room = await Room.findOne({ where: { code: req.params.roomCode } });
    if (!room) return res.status(404).json({ message: "Oda bulunamadı" });

    const questions = await Question.findAll({
      where: { quizId: room.quizId },
      order: [["order", "ASC"]],
    });
    if (room.status != "in-progress")
      return res.status(400).json({ message: "Quiz not in-progress" });
    if (questions.length == 0)
      return res.status(404).json({ message: "Soru bulunamadı" });
    res.json({ questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Sorular alınamadı" });
  }
};

exports.scoreboard = async (req, res) => {
  try {
    const room = await Room.findOne({ where: { code: req.params.roomCode } });
    if (!room) return res.status(404).json({ message: "Oda bulunamadı" });

    if (room.status != "finished")
      return res.status(400).json({ message: "Quiz not finished" });

    const participants = await room.getParticipants({
      attributes: ["username", "score"],
      order: [["score", "DESC"]],
    });

    res.json({ participants });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Skor tablosu alınamadı" });
  }
};
