const sequelize = require("../db");

const User = require("./User");
const Room = require("./Room");
const Quiz = require("./Quiz");
const Question = require("./Question");
const Participant = require("./Participant");
const QuizHistory = require("./QuizHistory");

User.hasMany(Room, {
	foreignKey: "hostId",
	as: "hostedRooms",
});
Room.belongsTo(User, {
  foreignKey: "hostId",
  as: "host",
});

User.hasMany(Quiz, {
	foreignKey: "userId",
	as: "quizzes",
	onDelete: "CASCADE",
});
Quiz.belongsTo(User, {
	foreignKey: "userId",
	as: "creator",
	onDelete: "CASCADE",
});

Quiz.hasMany(Room, {
	foreignKey: "quizId",
	as: "rooms",
	onDelete: "SET NULL",
});
Room.belongsTo(Quiz, {
	foreignKey: "quizId",
	as: "quiz",
	onDelete: "SET NULL",
});

Quiz.hasMany(Question, {
	foreignKey: "quizId",
	as: "questions",
	onDelete: "CASCADE",
});
Question.belongsTo(Quiz, {
	foreignKey: "quizId",
	as: "quiz",
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
  Quiz,
  Question,
  Participant,
  QuizHistory,
};
