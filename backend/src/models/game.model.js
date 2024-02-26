const mongoose = require("mongoose");

const playeSchema = new mongoose.Schema({
  currentWordIndex: {
    type: Number,
    default: 0,
  },
  socketId: {
    type: String,
  },
  isPartyLeader: {
    type: Boolean,
    default: false,
  },
  WPM: {
    type: Number,
    default: -1,
  },
  nickName: {
    type: String,
    required: true,
  },
});

const gameSchema = new mongoose.Schema({
  words: [
    {
      type: String,
      required: true,
      validate: {
        validator: (array) => array.length > 0,
        message: "At least one word is required.",
      },
    },
  ],
  isOpen: {
    type: Boolean,
    default: true,
  },
  isOver: {
    type: Boolean,
    default: false,
  },
  players: [playeSchema],
  startTime: {
    type: Number,
  },
});

const GameModel = mongoose.model("Game", gameSchema);
module.exports = GameModel;
