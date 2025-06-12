const { Quiz } = require('../models');

exports.create = async (req, res) => {
  try {

    res.json("");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Quiz oluşturulamadı.' });
  }
};

exports.list = async (req, res) => {
	try {
		
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Quiz listesi alınamadı.' });
	}
};

