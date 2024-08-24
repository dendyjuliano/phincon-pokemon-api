const axios = require("axios");
const { BASE_URL, getAbilityDetails } = require("../utils");

const getPokemons = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const offset = (page - 1) * limit;

    const response = await axios.get(
      `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`
    );

    const pokemons = await Promise.all(
      response.data.results.map(async (pokemon, index) => {
        const detailResponse = await axios.get(pokemon.url);

        const speciesResponse = await axios.get(
          detailResponse.data.species.url
        );

        const descriptionEntry = speciesResponse.data.flavor_text_entries.find(
          (entry) => entry.language.name === "en"
        );
        const description = descriptionEntry
          ? descriptionEntry.flavor_text
          : "No description available.";

        return {
          id: detailResponse.data.id,
          name: pokemon.name,
          imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${detailResponse.data.id}.png`,
          height: detailResponse.data.height,
          weight: detailResponse.data.weight,
          types: detailResponse.data.types.map((typeObj) => typeObj.type.name),
          description: description,
        };
      })
    );

    res.json({
      currentPage: page,
      totalPages: Math.ceil(response.data.count / limit),
      pokemons,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch Pokemon list",
      message: error.message,
    });
  }
};

const getPokemonDetail = async (req, res) => {
  try {
    const { id } = req.params;

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

    res.json({
      id: pokemon.id,
      name: pokemon.name,
      height: pokemon.height,
      weight: pokemon.weight,
      types: pokemon.types.map((typeObj) => typeObj.type.name),
      imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`,
      description: description,
      abilities: abilitiesWithEffects,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch Pokémon details",
      message: error.message,
    });
  }
};

const catchPokemon = (req, res) => {
  const isCaught = Math.random() < 0.5;
  if (isCaught) {
    res.json({ success: true, message: "Pokemon caught" });
  } else {
    res.json({ success: false, message: "Pokemon escaped, come on try again" });
  }
};

module.exports = {
  getPokemons,
  getPokemonDetail,
  catchPokemon,
};
