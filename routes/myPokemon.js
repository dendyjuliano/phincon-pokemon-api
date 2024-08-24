const express = require("express");
const {
  addPokemon,
  getMyPokemons,
  releasePokemon,
  renamePokemon,
} = require("../controllers/myPokemonController");

const router = express.Router();

router.post("/add", addPokemon);
router.get("/", getMyPokemons);
router.post("/release", releasePokemon);
router.post("/rename", renamePokemon);

module.exports = router;
