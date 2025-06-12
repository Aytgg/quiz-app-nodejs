const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Quiz = sequelize.define(
  "Quiz",
  {
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = Question;
