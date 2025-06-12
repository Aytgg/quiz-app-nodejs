const passport = require("passport");

exports.isAuth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) return res.status(500).json({ error: "Sunucu hatası" });
    if (!user) return res.status(401).json({ error: "Giriş yapmalısınız" });

    req.user = user;
    next();
  })(req, res, next);
};

exports.isNoAuth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) return res.status(500).json({ message: "Sunucu hatası" });
    if (user) return res.status(403).json({ message: "Zaten giriş yapılmış" });

    next();
  })(req, res, next);
};
