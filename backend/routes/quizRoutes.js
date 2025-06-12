const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");
const { isAuth } = require("../middlewares/authMiddleware");

router.post("/create", isAuth, quizController.create);
router.get("/list", isAuth, quizController.list);

module.exports = router;
