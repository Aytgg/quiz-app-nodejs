const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Room = sequelize.define(
  "Room",
  {
    code: {
      type: DataTypes.STRING(6),
      allowNull: false,
      unique: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("waiting", "in-progress", "finished"),
      defaultValue: "waiting",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = Room;
