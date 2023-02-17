const mongoose = require("mongoose");

const gameSchema = mongoose.Schema({
  _id: Number,
  host_id: Number,
  started: { type: Boolean, default: false },
  lastTurns: { type: Boolean, default: false },
  turnsRemaining: Number,
  complete: { type: Boolean, default: false },
  players: [{ name: String, position: Number, score: Number }],
  turns: [{ name: String, score: Number }],
});

module.exports = mongoose.model("Game", gameSchema);
