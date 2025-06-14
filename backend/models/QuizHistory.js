const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const QuizHistory = sequelize.define(
	"QuizHistory", {
		playedAt: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
		results: {
			type: DataTypes.JSON, // [{ username, score }]
			allowNull: false,
		},
		totalQuestions: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
  {
	timestamps: false,
  }
);

module.exports = QuizHistory;
