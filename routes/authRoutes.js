const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { isAuth } = require("../middlewares/authMiddleware");

router.post("/register", isAuth, authController.register);
router.post("/login", isAuth, authController.login);

module.exports = router;
