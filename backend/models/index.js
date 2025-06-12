const sequelize = require("../db");

const User = require("./User");
const Room = require("./Room");
const Question = require("./Question");
const Participant = require("./Participant");
const QuizHistory = require("./QuizHistory");

User.hasMany(Room, {
	foreignKey: "hostId",
	as: "hostedRooms",
});
Room.belongsTo(User, {
  foreignKey: "hostId",
});

Room.hasMany(Question, {
	foreignKey: "roomId",
	as: "questions",
	onDelete: "CASCADE",
});
Question.belongsTo(Room, {
	foreignKey: "roomId",
});

Room.hasMany(Participant, {
	foreignKey: "roomId",
	as: "participants",
	onDelete: "CASCADE",
});
Participant.belongsTo(Room, {
	foreignKey: "roomId",
});

User.hasMany(QuizHistory, {
	foreignKey: "userId",
	as: "quizHistory",
	onDelete: "CASCADE",
});
QuizHistory.belongsTo(User, {
  foreignKey: "userId",
});
QuizHistory.belongsTo(Room, {
	foreignKey: "roomId",
	onDelete: "SET NULL",
});

module.exports = {
  sequelize,
  User,
  Room,
  Question,
  Participant,
	QuizHistory,
};
