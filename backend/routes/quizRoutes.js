const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");
const { isAuth } = require("../middlewares/authMiddleware");

router.get("/list", isAuth, quizController.list);
router.get("/:id", isAuth, quizController.detail);
router.post("/create", isAuth, quizController.create);

module.exports = router;
