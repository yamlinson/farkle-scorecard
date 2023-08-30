const asyncHandler = require("express-async-handler");

const Game = require("../models/game.model");

/*
 * Public
 */
// @desc    Get info for game by id
// @route   GET /api/game/:id
// @access  Public
const getGame = asyncHandler(async (req, res) => {
  const game = await Game.findById(req.params.id);
  if (!game) {
    return res.status(404).send("Game not found");
  }
  return res.status(200).json(game);
});
// @desc    Get games by host_id
// @route   GET /api/game/host/:id
// @access  Public
const getGamesByHost = asyncHandler(async (req, res) => {
  const games = await Game.find({ host_id: req.params.id }, "_id");
  return res.status(200).json(games);
});
// @desc    Get all games
// @route   GET /api/game/all
// @access  Public
const getAllGames = asyncHandler(async (req, res) => {
  const games = await Game.find({}, "_id host_id");
  return res.status(200).json(games);
});

/*
 * Private
 */
// @desc    Create new game
// @route   POST /api/game
// @access  Private
const createGame = asyncHandler(async (req, res) => {
  const user = 1; // TODO: replace with user ID
  const maxGames = 5;
  const currentGames = await Game.find({ host_id: user }).count();
  if (currentGames >= maxGames) {
    return res
      .status(403)
      .send(`Game limit reached ${currentGames}/${maxGames}`);
  }
  var newID;
  while (true) {
    newID = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
    const found = await Game.findById(newID);
    if (!found) {
      break;
    }
  }
  const game = await Game.create({
    _id: newID,
    host_id: user,
  });
  return res.status(201).json(game);
});
// @desc    Destroy game
// @route   DELETE /api/game/:id
// @access  Private
const destroyGame = asyncHandler(async (req, res) => {
  const game = await Game.findById(req.params.id);
  if (!game) {
    return res.status(404).send("Game not found");
  }
  await Game.deleteOne({ _id: req.params.id });
  return res.status(204).json();
});
// @desc    Set players
// @route   PUT /api/game/:id/players
// @access  Private
const setPlayers = asyncHandler(async (req, res) => {
  if (req.body.players.length < 2) {
    return res.status(400).send("Must include info for at least 2 players");
  }
  var game = await Game.findById(req.params.id);
  if (game.started) {
    return res.status(400).send("Players cannot be changed after game start");
  }
  game = await Game.updateOne(
    { _id: req.params.id },
    { players: req.body.players }
  );
  return res.status(200).json(game);
});
// @desc    Start game
// @route   PUT /api/game/:id
// @access  Private
const startGame = asyncHandler(async (req, res) => {
  var game = await Game.findById(req.params.id);
  if (!game) {
    return res.status(404).send("Not found");
  }
  if (game.players.length < 2) {
    return res.status(400).send("Add at least 2 players to start");
  }
  game = await Game.updateOne({ _id: req.params.id }, { started: true });
  return res.status(200).json(game);
});
// @desc    Submit turn
// @route   PUT /api/game/:id/turn
// @access  Private
const submitTurn = asyncHandler(async (req, res) => {
  var game = await Game.findById(req.params.id);
  if (!game) {
    return res.status(400).send(`Game ${req.params.id} not found`);
  }
  if (!game.started) {
    return res
      .status(400)
      .send("Game must be started before turns can be submitted");
  }
  if (!req.body.name || !req.body.score) {
    return res.status(400).send("Must include name and score");
  }
  const playerFound = await Game.findOne({
    _id: req.params.id,
    players: { $elemMatch: { name: req.body.name } },
  });
  if (!playerFound) {
    return res.status(400).send(`Player ${req.body.name} not found`);
  }
  await Game.updateOne({ _id: req.params.id }, { $push: { turns: req.body } });
  game = await Game.updateOne(
    { _id: req.params.id, "players.name": req.body.name },
    { $inc: { "players.$.score": req.body.score } }
  );
  return res.status(201).json(game);
});
// @desc    Undo turn
// @route   DELETE /api/game/:id/turn
// @access  Private
const undoTurn = asyncHandler(async (req, res) => {
  var game = await Game.findById(req.params.id);
  if (!game) {
    return res.status(400).send(`Game ${req.params.id} not found`);
  }
  const turnCount = game.turns.length;
  if (turnCount <= 0) {
    return res.status(400).send("No turn to pop");
  }
  const previousTurn = game.turns[turnCount - 1];
  await Game.updateOne({ _id: req.params.id }, { $pop: { turns: 1 } });
  game = await Game.updateOne(
    { _id: req.params.id, "players.name": previousTurn.name },
    { $inc: { "players.$.score": 0 - previousTurn.score } }
  );
  return res.status(200).json(game);
});

module.exports = {
  getGame,
  getGamesByHost,
  getAllGames,
  createGame,
  destroyGame,
  setPlayers,
  startGame,
  submitTurn,
  undoTurn,
};
