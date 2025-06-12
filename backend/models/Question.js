const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Question = sequelize.define(
  "Question",
  {
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    options: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    answer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = Question;
