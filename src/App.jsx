import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import './index.css'; // Your styles for the vibrant background are in here
import search from './search.png';

function App() {
  const [pokemon, setPokemon] = useState('');
  const [pokemonData, setPokemonData] = useState(null);
  const [error, setError] = useState('');
  const [pokemonNames, setPokemonNames] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const TYPE_COLORS = {
    normal: '#a8a878',
    fire: '#ff5733',
    water: '#3399ff',
    electric: '#ffcc33',
    grass: '#5cb85c',
    ice: '#6ad6f0',
    fighting: '#c03028',
    poison: '#a040a0',
    ground: '#e0c068',
    flying: '#a890f0',
    psychic: '#ff6b9d',
    bug: '#a8b820',
    rock: '#b8a038',
    ghost: '#705898',
    dragon: '#7038f8',
    dark: '#705848',
    steel: '#b8b8d0',
    fairy: '#ffb7fa'
  };

  useEffect(() => {
    const fetchPokemonNames = async () => {
      try {
        const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=1000");
        const names = response.data.results.map(p => p.name);
        setPokemonNames(names);
      } catch (err) {
        console.error('Error fetching Pokémon names:', err);
      }
    };
    fetchPokemonNames();
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setPokemon(value);

    if (value) {
      const filteredSuggestions = pokemonNames
        .filter(name => name.toLowerCase().startsWith(value.toLowerCase()))
        .slice(0, 10);
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setPokemon(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
    fetchPokemonData(suggestion);
  };

  const fetchPokemonData = async (id = pokemon) => {
    if (!id) return;

    setError('');
    setLoading(true);

    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id.toLowerCase()}`);
      setPokemonData(response.data);
    } catch (err) {
      setError('Pokémon not found. Try another name or ID.');
      setPokemonData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPokemonData();
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSurpriseMe = () => {
    const random = Math.floor(Math.random() * 898) + 1;
    fetchPokemonData(random.toString());
    setPokemon('');
  };

  // --- This is the fix for the white background ---
  const getHighQualityImage = (id) => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  };

  const getStatColor = (value) => {
    if (value >= 100) return '#5cb85c';
    if (value >= 60) return '#3399ff';
    if (value >= 40) return '#ffcc33';
    return '#ff5733';
  };

  return (
    // --- Removed the "scene-manager" div ---
    // Your .app-container will now be the top-level element
    // and will pick up your original purple background style
    <div className="app-container">
      {/* Header */}
      <motion.header
        className="header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="logo-container">
          <div className="pokeball-decoration"></div>
          <div className="pokeball-decoration"></div>
        </div>
        <motion.h1
          className="header-title"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          PokéDex
        </motion.h1>
        <motion.p
          className="header-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Catch 'em All - Explore Every Pokémon
        </motion.p>
      </motion.header>

      {/* Search Section */}
      <motion.section
        className="search-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="search-wrapper">
          <motion.div
            className="search-container"
            whileTap={{ scale: 0.98 }}
          >
            <img src={search} alt="Search" className="search-icon" />
            <form className="search-form" onSubmit={handleSearch}>
              <input
                ref={inputRef}
                type="text"
                className="search-input"
                placeholder="Search Pokémon..."
                value={pokemon}
                onChange={handleInputChange}
                onFocus={() => setShowSuggestions(pokemon.length > 0)}
              />
            </form>
          </motion.div>

          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.ul
                className="suggestions-list"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                {suggestions.map((suggestion, index) => (
                  <motion.li
                    key={suggestion}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(suggestion)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {suggestion}
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          className="action-buttons"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <motion.button
            type="submit"
            className="btn"
            onClick={handleSearch}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Search
          </motion.button>
          <motion.button
            className="btn btn-secondary"
            onClick={handleSurpriseMe}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Surprise Me
          </motion.button>
        </motion.div>
      </motion.section>

      {/* Loading State */}
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            className="loading-container"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <div className="spinner-pokeball" />
            <p className="loading-text">Catching Pokémon...</p>
          </motion.div>
        )}

        {/* Error State */}
        {error && !loading && (
          <motion.div
            className="error-container"
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <h3 className="error-title">Oops!</h3>
            <p className="error-message">{error}</p>
          </motion.div>
        )}

        {/* Pokemon Card */}
        {pokemonData && !loading && (
          <motion.div
            className="pokemon-card"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 15,
              duration: 0.6
            }}
          >
            {/* Header */}
            <div className="pokemon-header">
              <div className="pokemon-header-content">
                <div className="pokemon-info-left">
                  <motion.h2
                    className="pokemon-name"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    {pokemonData.name}
                  </motion.h2>
                  <motion.p
                    className="pokemon-id"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    #{String(pokemonData.id).padStart(3, '0')}
                  </motion.p>
                  <motion.div
                    className="pokemon-types"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {pokemonData.types.map((typeInfo, index) => (
                      <motion.span
                        key={typeInfo.type.name}
                        className="type-badge"
                        style={{ backgroundColor: TYPE_COLORS[typeInfo.type.name] }}
                        initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{
                          delay: 0.5 + index * 0.1,
                          type: "spring",
                          stiffness: 200
                        }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        {typeInfo.type.name}
                      </motion.span>
                    ))}
                  </motion.div>
                </div>
                <motion.div
                  className="pokemon-image-container"
                  initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{
                    delay: 0.3,
                    type: "spring",
                    stiffness: 100,
                    damping: 12
                  }}
                  whileHover={{ scale: 1.05, rotate: 5 }}
                >
                  {/* --- This uses the updated function with the ID --- */}
                  <img
                    src={getHighQualityImage(pokemonData.id)}
                    alt={pokemonData.name}
                    className="pokemon-image"
                  />
                </motion.div>
              </div>
            </div>

            {/* Body */}
            <div className="pokemon-body">
              {/* Physical Stats */}
              <motion.div
                className="detail-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                style={{ marginBottom: '2rem' }}
              >
                <h3 className="detail-title">Physical Attributes</h3>
                <div className="physical-stats">
                  <motion.div
                    className="physical-stat"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="physical-stat-value">
                      {(pokemonData.height / 10).toFixed(1)}m
                    </div>
                    <div className="physical-stat-label">Height</div>
                  </motion.div>
                  <motion.div
                    className="physical-stat"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <div className="physical-stat-value">
                      {(pokemonData.weight / 10).toFixed(1)}kg
                    </div>
                    <div className="physical-stat-label">Weight</div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Stats */}
              <motion.div
                className="stats-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <h3 className="section-title">Base Stats</h3>
                <div className="stats-grid">
                  {pokemonData.stats.map((stat, index) => (
                    <motion.div
                      key={stat.stat.name}
                      className="stat-item"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.05 }}
                      whileHover={{ y: -4 }}
                    >
                      <div className="stat-label">
                        <span className="stat-name">
                          {stat.stat.name.replace('-', ' ')}
                        </span>
                        <span className="stat-value">{stat.base_stat}</span>
                      </div>
                      <div className="stat-bar-container">
                        <motion.div
                          className="stat-bar"
                          style={{
                            backgroundColor: getStatColor(stat.base_stat)
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${(stat.base_stat / 255) * 100}%` }}
                          transition={{
                            delay: 1 + index * 0.05,
                            duration: 0.8,
                            ease: [0.4, 0, 0.2, 1]
                          }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Abilities and Moves */}
              <div className="details-grid">
                <motion.div
                  className="detail-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 }}
                >
                  <h3 className="detail-title">Abilities</h3>
                  <div className="abilities-list">
                    {pokemonData.abilities.map((ability, index) => (
                      <motion.span
                        key={ability.ability.name}
                        className="ability-badge"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          delay: 1.4 + index * 0.1,
                          type: "spring",
                          stiffness: 200
                        }}
                        whileHover={{ scale: 1.1, rotate: 2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {ability.ability.name.replace('-', ' ')}
                        {ability.is_hidden && ' (Hidden)'}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  className="detail-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 }}
                >
                  <h3 className="detail-title">
                    Moves ({pokemonData.moves.length})
                  </h3>
                  <div className="moves-grid">
                    {pokemonData.moves.slice(0, 20).map((move, index) => (
                      <motion.div
                        key={move.move.name}
                        className="move-badge"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          delay: 1.5 + index * 0.02,
                          type: "spring"
                        }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {move.move.name.replace('-', ' ')}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <motion.footer
        className="footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <p>Gotta Catch 'Em All!</p>
        <div className="social-links">
          <motion.a
            href="https://github.com/mohittshukla"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
            whileHover={{ y: -4, scale: 1.05 }}
            whileTap={{ y: 0 }}
          >
            <i className="fab fa-github"></i>
          </motion.a>
          <motion.a
            href="mailto:mohittshukla1@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
            whileHover={{ y: -4, scale: 1.05 }}
            whileTap={{ y: 0 }}
          >
            <i className="fas fa-envelope"></i>
          </motion.a>
        </div>
      </motion.footer>
    </div>
  );
}

export default App;
