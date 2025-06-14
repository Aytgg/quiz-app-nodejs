const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController");
const { isAuth } = require("../middlewares/authMiddleware");
const { route } = require("..");

router.post("/check", roomController.check);
router.post("/", isAuth, roomController.create);
router.post("/:roomCode/questions", roomController.questions);
router.get("/:roomCode/scoreboard", roomController.scoreboard);

module.exports = router;
