const { Quiz, Question, User } = require('../models');

exports.create = async (req, res) => {
  const { title, description, questions } = req.body;
  const userId = req.user.id;

  try {
    const quiz = await Quiz.create(
      {
        title,
        description: description || null,
        userId,
        questions
      },
      {
        include: [{
          model: Question,
          as: 'questions'
        }]
      }
    );

    res.status(201).json({ message: 'Quiz oluşturuldu', quizId: quiz.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Quiz oluşturulamadı' });
  }
};

exports.list = async (req, res) => {
  try {
    const quizzes = await Quiz.findAll({
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['username']
        },
        {
          model: Question,
          as: 'questions',
          attributes: ['id',]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    const result = quizzes.map((quiz) => ({
      id: quiz.id,
      title: quiz.title,
      description: quiz.description || null,
      creator: quiz.creator.username,
      questionCount: quiz.questions.length
    }));

    if (result.length == 0)
      return res.status(404).json({ message: 'Quiz bulunamadı' });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Quiz listesi alınamadı' });
  }
};

exports.detail = async (req, res) => {
  const quizId = req.params.id;

  try {
    const quiz = await Quiz.findByPk(quizId, {
      include: [
        {
          model: User,
          attributes: ['username']
        },
        {
          model: Question,
          attributes: ['id', 'text', 'options', 'correctOption']
        }
      ]
    });

    if (!quiz)
      return res.status(404).json({ message: 'Quiz bulunamadı' });

    res.json({
      id: quiz.id,
      title: quiz.title,
      creator: quiz.User.username,
      questions: quiz.Questions
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Quiz detayları alınamadı' });
  }
};

exports.delete = async (req, res) => {
	const quizId = req.params.id;
	const userId = req.user.id;

	try {
		const quiz = await Quiz.findOne({
			where: { id: quizId, userId }
		});

		if (!quiz)
			return res.status(404).json({ message: 'Quiz bulunamadı veya yetkiniz yok' });

		await quiz.destroy();
		res.json({ message: 'Quiz silindi' });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Quiz silinemedi' });
	}
};