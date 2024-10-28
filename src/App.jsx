import React from "react";
import axios from "axios";
import './index.css'
import pokedex from './pokedex.webp'
import search from './search.png'

import { useState } from "react";


function App() {
  const [pokemon,setPokemon] = useState('');
  const [pokemonData,setPokemonData] = useState(null);
  const [error,setError] = useState('');

  const fetchPokemonData = async (id = pokemon) => {
    setError('');
    try {
      let response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id.toLowerCase()}`);
      setPokemonData(response.data);
    }
    catch (err){
        setError('pokemon Not Found');
        setPokemonData(null);
    }
  }
  
  const handleSearch = (e) =>{
    e.preventDefault();
    fetchPokemonData();
  }

  const handleSurpriseMe = () => {
    const random = Math.floor(Math.random() * 898) + 1;
    console.log("Fetching Pokémon with ID:", random); // Log the random ID
    fetchPokemonData(random.toString());
  };

  const getHighQualityImage = (name) => {
    return `https://img.pokemondb.net/artwork/large/${name}.jpg`; // Example URL for higher quality images
  };
  return (
      <div id= "container">
        <h1>
        <img src={pokedex} alt="pokedex" style={{height:"100px",width:"300px",marginTop:"10px"}}/>
</h1>
        <img src="/public/images/pokeball.png" alt="" />
        <div className="search-container">
        <span className="search-icon"><img src= {search} alt="search"/></span> 
        <form className="form" onSubmit={handleSearch}>
          <input id = "search" type="text" 
          placeholder="pikachu"
          value={pokemon}
          onChange={(e) => setPokemon(e.target.value)}
          />
        </form>

        </div>
        <div>
          <button onClick={handleSurpriseMe} className="button">Surprise Me!!!</button>
        </div>

        
        {error && <p style={{ color: 'red' }}>{error}</p>}
            {pokemonData && pokemonData.name && (
                <div className="card" style={{ marginTop: '20px' }}>
                    <h2>{pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)}</h2>
                    <img src={getHighQualityImage(pokemonData.name)} alt={pokemonData.name}
                    style={{height:'150px',width:'180px'}} />
                    <p className="height">Height: {((pokemonData.height*0.1).toFixed(2))} m</p>
                    <p className="weight">Weight: {((pokemonData.weight*0.1).toFixed(2))} kg</p>
                    <p className="type">{pokemonData.types.map(typeInfo => typeInfo.type.name).join(' type, ')} type</p>
                </div>
                
            )}

          <div className="social-links">
  {/* GitHub Link */}
  <a 
    href="https://github.com/mohittshukla" 
    target="_blank" 
    rel="noopener noreferrer"
    style={{marginRight:"15px"}}
    className="social-icon" // Add a class for styling
  >
    <i className="fab fa-github"></i>
  </a>

  {/* Email Link */}
  <a 
    href="mailto:mohittshukla1@gmail.com" 
    target="_blank" 
    rel="noopener noreferrer"
    className="social-icon" // Add a class for styling
  >
    <i className="fas fa-envelope"></i>
  </a>
</div>

    
      </div>
      
  );
}

export default App;
