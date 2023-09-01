const mongoose = require("mongoose");

const gameSchema = mongoose.Schema({
  _id: Number,
  hostUser: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  started: { type: Boolean, default: false },
  lastTurns: { type: Boolean, default: false },
  turnsRemaining: Number,
  complete: { type: Boolean, default: false },
  players: [{ name: String, position: Number, score: Number }],
  turns: [{ name: String, score: Number }],
});

module.exports = mongoose.model("Game", gameSchema);
