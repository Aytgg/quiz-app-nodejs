const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const bcrypt = require("bcrypt");
const { User } = require("./models");

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      let user = await User.findOne({ where: { username } });
      if (!user) return done(null, false, { message: "Kullanıcı bulunamadı" });

      if (await bcrypt.compare(password, user.password))
        return done(null, false, { message: "Hatalı şifre" });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (jwt_payload, done) => {
      try {
        let user = await User.findByPk(jwt_payload.sub);

        if (!user) return done(null, false);

        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    },
  ),
);

module.exports = passport;