const express = require('express');
const router = express.Router();
const quizHistoryController = require('../controllers/quizHistoryController');
const { isAuth } = require('../middlewares/authMiddleware');

router.get('/', isAuth, quizHistoryController.getHistory);

module.exports = router;