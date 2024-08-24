const axios = require("axios");
const { isPrime, fibonacci, getAbilityDetails, BASE_URL } = require("../utils");

let myPokemonList = [];

const addPokemon = async (req, res) => {
  try {
    const { id, nickname } = req.body;

    const response = await axios.get(`${BASE_URL}/pokemon/${id}`);
    const pokemon = response.data;

    const speciesResponse = await axios.get(pokemon.species.url);

    const descriptionEntry = speciesResponse.data.flavor_text_entries.find(
      (entry) => entry.language.name === "en"
    );
    const description = descriptionEntry
      ? descriptionEntry.flavor_text
      : "No description available.";

    const abilitiesWithEffects = await Promise.all(
      pokemon.abilities.map(async (abilityObj) => {
        const effects = await getAbilityDetails(abilityObj.ability.url);
        return {
          name: abilityObj.ability.name,
          effects,
        };
      })
    );

    const newPokemon = {
      id: pokemon.id,
      name: pokemon.name,
      nickname,
      abilities: abilitiesWithEffects,
      imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`,
      height: pokemon.height,
      weight: pokemon.weight,
      types: pokemon.types.map((typeObj) => typeObj.type.name),
      description,
      renameCount: 0,
    };

    myPokemonList.push(newPokemon);

    res
      .status(201)
      .json({ message: "Pokemon added to the list", pokemon: newPokemon });
  } catch (error) {
    console.error("Error adding Pokemon:", error.message);
    res.status(500).json({
      error: "Failed to add Pokemon to the list",
      message: error.message,
    });
  }
};

const getMyPokemons = (req, res) => {
  res.json(myPokemonList);
};

const releasePokemon = (req, res) => {
  const { nickname } = req.body;
  const prime = Math.floor(Math.random() * 100);
  if (isPrime(prime)) {
    myPokemonList = myPokemonList.filter(
      (pokemon) => pokemon.nickname !== nickname
    );
    res.json({
      success: true,
      message: `Pokemon released successfully with prime ${prime}`,
      prime,
    });
  } else {
    res.json({ success: false, message: "Failed to release Pokemon", prime });
  }
};

const renamePokemon = (req, res) => {
  const { nickname, newNickname } = req.body;
  const pokemon = myPokemonList.find((p) => p.nickname === nickname);
  if (pokemon) {
    pokemon.renameCount += 1;
    pokemon.nickname = `${newNickname}-${fibonacci(pokemon.renameCount)}`;
    res.json({ message: "Pokemon renamed successfully", pokemon });
  } else {
    res.status(404).json({ error: "Pokemon not found" });
  }
};

module.exports = {
  addPokemon,
  getMyPokemons,
  releasePokemon,
  renamePokemon,
};
