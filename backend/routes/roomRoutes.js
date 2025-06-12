const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController");
const { isAuth } = require("../middlewares/authMiddleware");

router.post("/create", isAuth, roomController.create);

module.exports = router;
