const { Sequelize } = require("sequelize");
const path = require("path");
require("dotenv").config();

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "quiz.db"),
  logging: false,
});

sequelize
  .authenticate()
  .then(() => {
    console.log("DB Connected!");
  })
  .catch((err) => {
    console.log("DB Connection Error: " + err);
  });

module.exports = sequelize;
