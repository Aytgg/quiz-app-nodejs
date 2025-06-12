const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../models");
const { Op } = require("sequelize");

exports.register = async (req, res) => {
  try {
    let { username, email, password, passwordagain } = req.body;

    if (password !== passwordagain)
      return res.status(400).json({ message: "Şifreler eşleşmiyor" });

    if (
      await User.findOne({
        where: {
          [Op.or]: [{ username }, { email }],
        },
      })
    )
      return res
        .status(400)
        .json({ message: "Bu kullanıcı adı veya e-posta zaten kullanımda" });

    const newUser = await User.create({ username, email, password });

    const token = jwt.sign(
      { sub: newUser.id, username: newUser.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    res.json({ token, username: newUser.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Kayıt başarısız: " + err.message });
  }
};

exports.login = async (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
	console.log(err)
    if (err) return res.status(500).json({ error: "Sunucu hatası" });
    if (!user)
      return res
        .status(401)
        .json({ error: info?.message || "Giriş başarısız" });

    const token = jwt.sign(
      { sub: user.id, username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );
    res.json({ token, username: user.username });
  })(req, res, next);
};
