const express = require("express");
const router = express.Router();
const {
  getGame,
  createGame,
  startGame,
  destroyGame,
  setPlayers,
  submitTurn,
  undoTurn,
  getGamesByHost,
  getAllGames,
} = require("../controllers/game.controller");

router.route("/").post(createGame);
router.route("/all").get(getAllGames);
router.route("/:id").get(getGame).put(startGame).delete(destroyGame);
router.route("/:id/players").put(setPlayers);
router.route("/:id/turn").put(submitTurn).delete(undoTurn);
router.route("/host/:id").get(getGamesByHost);

module.exports = router;
