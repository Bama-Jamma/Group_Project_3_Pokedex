// Get the .pokedex element
var pokedex = document.getElementById('pokedex');
var screen = document.querySelector('.screen');
var currentPokemon = 1;

function updateScreen(pokemonData) {
    screen.innerHTML = ''; // Clear the content of the screen div
    screen.innerHTML = `
        <h2>${pokemonData.name}</h2>
        <img src="${pokemonData.sprites.front_default}" class="pokemon-img" />
    `;
}

function fetchPokemon(id) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then(response => response.json())
        .then(data => updateScreen(data))
        .catch(error => console.error(error));
}

pokedex.addEventListener('click', function() {
    if (pokedex.classList.contains('closed')) {
        pokedex.classList.remove('closed');
        pokedex.classList.add('open');
        fetchPokemon(currentPokemon);
        currentPokemon++;
    } else {
        pokedex.classList.remove('open');
        pokedex.classList.add('closed');
    }
});
