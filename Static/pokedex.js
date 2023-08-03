// Get the .pokedex element
var pokedex = document.getElementById('pokedex');

// Add a click event listener
pokedex.addEventListener('click', function() {
  // Check if it's currently open or closed, then switch the class
  if (pokedex.classList.contains('closed')) {
    pokedex.classList.remove('closed');
    pokedex.classList.add('open');
  } else {
    pokedex.classList.remove('open');
    pokedex.classList.add('closed');
  }
});
