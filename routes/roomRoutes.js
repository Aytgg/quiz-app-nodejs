const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController");
const { isAuth } = require("../middlewares/authMiddleware");

router.post("/create", isAuth, roomController.createRoom);

module.exports = router;
