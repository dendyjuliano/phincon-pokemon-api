const express = require("express");
const cors = require("cors");

const pokemonRoutes = require("./routes/pokemon");
const myPokemonRoutes = require("./routes/myPokemon");

const app = express();
app.use(cors());

app.use(express.json());

app.use("/pokemons", pokemonRoutes);
app.use("/my-pokemons", myPokemonRoutes);

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
