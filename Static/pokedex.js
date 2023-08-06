
 function init() {
    // Select dropdown menu 
    var dropdown = document.getElementById('selDataset');
    
    // URL to fetch data from
    var url = 'http://127.0.0.1:5000/pokemons/';

    // Use XMLHttpRequest to read data from URL/server
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.send();
    
      request.onload = function() {
      // Check if request is successful (200) and parse data
      if (request.status === 200) {
        data = JSON.parse(request.responseText);
        
        let option;
        // Iterate through the data object and get values for dropdown menu
        for (let i = 0; i < data.pokemons.length; i++) {
          option = document.createElement('option');
          option.text = data.pokemons[i].pokemon_index_number + " - " + data.pokemons[i].name;
          option.value = data.pokemons[i].pokemon_index_number;
          dropdown.add(option);
        }
      } 
      
      else {
        console.error(error);
      }     
    }
  }
init(); 

// Function to fetch pokemon profile based on the value selcted in dropdown
function optionChanged(selectedValue){
  var url = 'http://127.0.0.1:5000/pokemon-profile/' + selectedValue;
  
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.send();

  request.onload = function() {
    if (request.status === 200) {
      var data = JSON.parse(request.responseText);

      document.getElementById('pokemonProfile').innerText = JSON.stringify(data, null, 2);

     } 
     // If Request to API fails, log error
     else {
      console.error(error);
    }     
  }

}