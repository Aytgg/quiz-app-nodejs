const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Participant = sequelize.define("Participant", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  score: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

module.exports = Participant;
