const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const QuizHistory = sequelize.define("QuizHistory", {
  totalQuestions: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  playedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  results: {
    type: DataTypes.JSON, // [{ username, score }]
    allowNull: true,
  },
});

module.exports = QuizHistory;
