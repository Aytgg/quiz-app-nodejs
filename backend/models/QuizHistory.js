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
			allowNull: true,
		},
	},
  {
	timestamps: true,
  }
);

module.exports = QuizHistory;
