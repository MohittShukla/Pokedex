import React, { useEffect,useRef, useState } from "react";
import axios from "axios";
import './index.css';
import pokedex from './pokedex.webp';
import search from './search.png';

function App() {
  const [pokemon, setPokemon] = useState('');
  const [pokemonData, setPokemonData] = useState(null);
  const [error, setError] = useState('');
  const [pokemonNames, setPokemonNames] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null); 

  useEffect(() => {
    const fetchPokemonNames = async () => {
      setError('');
      try {
        let response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=1000");
        const names = response.data.results.map(pokemon => pokemon.name);
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
      const filteredSuggestions = pokemonNames.filter(name => {
        return name.toLowerCase().startsWith(value.toLowerCase());
      });

      setSuggestions(filteredSuggestions);
      setShowSuggestions(true); // Show suggestions when typing
    } else {
      setShowSuggestions(false); // Hide suggestions if input is empty
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setPokemon(suggestion);
    setSuggestions([]);
    fetchPokemonData(suggestion);
    inputRef.current.focus();
    setShowSuggestions(false); // Hide suggestions after selecting
  };

  const fetchPokemonData = async (id = pokemon) => {
    setError('');
    try {
      let response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id.toLowerCase()}`);
      setPokemonData(response.data);
    } catch (err) {
      setError('Pokémon Not Found');
      setPokemonData(null);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPokemonData();
    setSuggestions([]);
    setShowSuggestions(false); // Hide suggestions after search
  };

  const handleSurpriseMe = () => {
    const random = Math.floor(Math.random() * 898) + 1;
    console.log("Fetching Pokémon with ID:", random);
    fetchPokemonData(random.toString());
  };

  const getHighQualityImage = (name) => {
    return `https://img.pokemondb.net/artwork/large/${name}.jpg`;
  };

  return (
    <div id="container">
      <h1>
        <img src={pokedex} alt="pokedex" style={{ height: "100px", width: "300px", marginTop: "10px" }} />
      </h1>
      <img src="/public/images/pokeball.png" alt="" />
      <div className="search-container"
        onMouseEnter={() => setShowSuggestions(true)}
        onMouseLeave={() => setShowSuggestions(false)}
      >
        <span className="search-icon"><img src={search} alt="search" /></span>
        <form className="form" onSubmit={handleSearch}>
          <input
            id="search"
            type="text"
            placeholder="pikachu"
            value={pokemon}
            ref={inputRef}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(pokemon.length > 0)} // Show suggestions when input is focused
          />
        </form>
        {showSuggestions && suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((suggestion, index) => (
              <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <button onClick={handleSurpriseMe} className="button">Surprise Me!!!</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {pokemonData && pokemonData.name && (
        <div className="card" style={{ marginTop: '20px' }}>
          <h2>{pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)}</h2>
          <img src={getHighQualityImage(pokemonData.name)} alt={pokemonData.name}
            style={{ height: '150px', width: '180px' }} />
          <p className="height">Height: {((pokemonData.height * 0.1).toFixed(2))} m</p>
          <p className="weight">Weight: {((pokemonData.weight * 0.1).toFixed(2))} kg</p>
          <p className="type">{pokemonData.types.map(typeInfo => typeInfo.type.name).join(' type, ')} type</p>
        </div>
      )}

      <div className="social-links">
        <a
          href="https://github.com/mohittshukla"
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginRight: "15px" }}
          className="social-icon"
        >
          <i className="fab fa-github"></i>
        </a>

        <a
          href="mailto:mohittshukla1@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon"
        >
          <i className="fas fa-envelope"></i>
        </a>
      </div>
    </div>
  );
}

export default App;
