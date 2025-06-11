const sequelize = require("../db");

const User = require("./User");
const Room = require("./Room");
const Question = require("./Question");
const Participant = require("./Participant");
const QuizHistory = require("./QuizHistory");

User.hasMany(Room);
Room.belongsTo(User, {
  foreignKey: {
    allowNull: true,
  },
});

Room.hasMany(Question);
Question.belongsTo(Room);

Room.hasMany(Participant);
Participant.belongsTo(Room);

User.hasMany(QuizHistory, { onDelete: "CASCADE" });
QuizHistory.belongsTo(User, {
  foreignKey: {
    allowNull: false,
  },
});

module.exports = {
  sequelize,
  User,
  Room,
  Question,
  Participant,
};
