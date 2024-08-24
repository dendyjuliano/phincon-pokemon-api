const express = require("express");
const {
  getPokemons,
  getPokemonDetail,
  catchPokemon,
} = require("../controllers/pokemonController");

const router = express.Router();

router.get("/", getPokemons);
router.get("/:id", getPokemonDetail);
router.post("/catch", catchPokemon);

module.exports = router;
