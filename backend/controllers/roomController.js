const { Room } = require("../models");
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
    const { id, hostId, status} = await Room.findOne({
      where: {
        code: roomCode
      }
    });

    if (!id || !hostId || !status)
      return res.status(404).json({ message: "Oda bulunamadı" });

    res.json({ id, hostId, status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Oda kontrol edilemedi" });
  }
};