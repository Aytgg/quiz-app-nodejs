const { QuizHistory } = require('../models');

exports.getHistory = async (req, res) => {
  try {
    const history = await QuizHistory.findAll({
      where: { userId: req.user.id },
      order: [['playedAt', 'DESC']]
    });

    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Geçmiş alınamadı' });
  }
};
