const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const bcrypt = require("bcrypt");

const User = sequelize.define(
  "User",
  {
    username: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
			type: DataTypes.STRING,
			allowNull: false
		},
  },
  {
    timestamps: true,
  }
);

User.beforeCreate(async (user) => {
  user.password = await bcrypt.hash(user.password, parseInt(process.env.HASH_SALTROUNDS));
});

module.exports = User;
