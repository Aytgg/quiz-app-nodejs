const { Room } = require("../models");
const generateRoomCode = require("../utils/generateRoomCode");

exports.createRoom = async (req, res) => {
  try {
    const code = generateRoomCode();

    const room = await Room.create({
      code,
      status: "waiting",
      userId: req.user.id,
    });

    res.status(201).json({ roomCode: room.code });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Oda oluşturulamadı" });
  }
};
