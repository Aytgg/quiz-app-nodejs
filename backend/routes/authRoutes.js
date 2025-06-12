const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { isNoAuth } = require("../middlewares/authMiddleware");

router.post("/register", isNoAuth, authController.register);
router.post("/login", isNoAuth, authController.login);

module.exports = router;
