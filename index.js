const express = require("express");
const passport = require("passport");
const SQLite = require("better-sqlite3");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const LocalStrategy = require("passport-local").Strategy;

const db = new SQLite("quiz.db");
dotenv.config();

const app = express();
app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    (username, password, done) => {
      var stmt = db.prepare("SELECT * FROM users WHERE username = ?");
      var user = stmt.get(username);

      if (!user) return done(null, false, { message: "Kullanıcı bulunamadı" });
      if (user.password != password)
        return done(null, false, { message: "Hatalı şifre" });

      return done(null, user);
    },
  ),
);

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      // callbackURL: "domain.com" + "/login",
      // issuer = 'accounts.examplesoft.com'
      // audience = 'yoursite.net',
    },
    (jwt_payload, done) => {
      var stmt = db.prepare("SELECT * FROM users WHERE id = ?");
      var user = stmt.get(jwt_payload.sub);
      if (user) return done(null, user);
      else return done(null, false);
    },
  ),
);

// Homepage route
app.get("/", (req, res) => {
  res.send(`
	<a href="/login"> Login </a>
	<br>
	<a href="/register"> Register </a>`);
});

// Login route GET
app.get("/login", checkNoAuth, (req, res) => {
  res.send(`
	<form method='post'>
	<input name='username' placeholder='username' />
	<br>
	<input name='email' placeholder='email' />
	<br>
	<input name='password' type='password' placeholder='password' />
	<br>
	<button type='submit'> LOGIN </button>
	<br>
	</form>`);
});

// Login route POST
app.post(
  "/login",
  checkNoAuth,
  passport.authenticate("local", { session: false, failureRedirect: "/login" }),
  (req, res) => {
    var token = jwt.sign(
      { sub: req.user.id, username: req.user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.json({ token });
  },
);

// Register route GET
app.get("/register", checkNoAuth, (req, res) => {
  res.send(`
	<form method='post'>
	<input name='username' placeholder='username' />
	<br>
	<input name='email' placeholder='email' />
	<br>
	<input name='password' type='password' placeholder='password' />
	<br>
	<input name='passwordagain' type='password' placeholder='password again' />
	<br>
	<button type='submit'> REGISTER </button>
	</form>`);
});

// Register route POST
app.post("/register", checkNoAuth, (req, res) => {
  var { username, email, password, passwordagain } = req.body;

  if (password != passwordagain)
    return res.status(400).send("Şifreler eşleşmiyor!");

  try {
    var hashedPassword = password; // await bcrypt.hash(password, process.env.HASH_SALTROUNDS);

    var stmt = db.prepare(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    );
    stmt.run(username, email, hashedPassword);

    var token = jwt.sign(
      { sub: req.user.id, username: req.user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.json({ token });
  } catch (err) {
    if (err.code == "SQLITE_CONSTRAINT")
      res.status(400).send("Bu kullanıcı adı zaten kullanımda!");
    else res.status(500).send("Hata: " + err.message);
  }
});

// Profile route GET
app.get("/profile", checkAuth, (req, res) => {
  res.send(`<a href="/logout"> Logout </a>`);
});

// Logout route DELETE
app.delete("/logout", (req, res) => {
  req.logOut(); // Only on session usages !!!
  res.redirect("/");
});

// isAuth Middleware
function checkAuth(req, res, next) {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err || !user) return res.redirect("/login");
    req.user = user;
    next();
  })(req, res, next);
}

// isNotAuth Middleware
function checkNoAuth(req, res, next) {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (user) return res.redirect("/profile");
    next();
  })(req, res, next);
}

// 404 Middleware
app.use((req, res, next) => {
  var err = new Error("Sayfa Bulunamadı!");
  err.status = 404;
  next(err);
});

app.listen(process.env.PORT, () =>
  console.log("Listening on PORT: " + process.env.PORT),
);

module.exports = app;
