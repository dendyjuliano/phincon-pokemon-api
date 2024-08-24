const axios = require("axios");

const isPrime = (num) => {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;
  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }
  return true;
};

const fibonacci = (n) => {
  if (n < 2) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
};

const getAbilityDetails = async (abilityUrl) => {
  try {
    const response = await axios.get(abilityUrl);
    return response.data.effect_entries;
  } catch (error) {
    console.error(`Failed to fetch ability details from ${abilityUrl}:`, error);
    return [];
  }
};

const BASE_URL = "https://pokeapi.co/api/v2";

module.exports = {
  isPrime,
  fibonacci,
  getAbilityDetails,
  BASE_URL,
};
