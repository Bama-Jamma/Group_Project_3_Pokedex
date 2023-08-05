// Creates a function that searches the api endpoint for pokemon profile
function fetchPokemonProfile(searchQuery) {
    return fetch(`/pokemon-profile/${searchQuery}`)
        .then(response => response.json());
}

// Creates a function that searches the api endpoint for pokemon stats    
function fetchPokemonStats(searchQuery) {
    return fetch(`/stat-comparison/${searchQuery}`)
        .then(response => response.json());  
}

// Random color function
function random_rgba() {
    let o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')';
}

let random_color = random_rgba();
let comparison_chart = null

// Function for drawing our Comparison Radar Chart(Spiderweb Chart)
function createComparisonChart(selectedPokemonStats, averageStatsData) {
    anychart.onDocumentReady(function () {
        if (!comparison_chart) {
            // If the chart doesn't exist, create a new one
            comparison_chart = anychart.radar();
        }

        // Sets the maximum scale for the web graph
        comparison_chart.yScale()
            .minimum(0)
            .maximum(255)
            .ticks({'interval':40});

        // Sets background
        comparison_chart.yGrid().palette(['gray 0.2', 'gray 0.3']);

        // Filter out the 'name' property from selectedPokemonStats
        const selectedData = Object.keys(selectedPokemonStats)
            .filter(key => key !== 'name')
            .map(key => ({ x: key, value: selectedPokemonStats[key] }))
            .filter(dataPoint => !isNaN(dataPoint.value));
        
        // Removes name and resets index    
        delete selectedData.name;
        const selectedDataWithResetIndex = selectedData.map((dataPoint, index) => ({ ...dataPoint, x: index.toString() }));

        // Convert the averageStatsData object to an array of data points
        const averageData = Object.keys(averageStatsData)
            .map(key => ({ x: key, value: averageStatsData[key] }));

        // Puts the data in the spiderweb
        const selectedPokemonSeries = comparison_chart.area(selectedDataWithResetIndex);
        selectedPokemonSeries.fill(random_color);
        selectedPokemonSeries.stroke('#ff0000');
        selectedPokemonSeries.markers(true);

        const averageStatsSeries = comparison_chart.area(averageData);
        averageStatsSeries.fill('rgba(100, 149, 237, 0.5)');
        averageStatsSeries.stroke('#6495ed');

        // Titles the graph
        comparison_chart.title('Pokemon Comparison Graph')

        // Attaches it to a div
        comparison_chart.container('comparison_web');

        // Draws the graph
        comparison_chart.draw();
    });
}

function createSpeedChart(selectedPokemonStats, averageStatsData, width, height, containerId) {
    // Get the labels for the x-axis domain
    const selectedLabels = selectedPokemonStats.map((_, index) => `Stat ${index + 1}`);
    const averageLabels = averageStatsData.map((_, index) => `Stat ${index + 1}`);
    const labels = [...selectedLabels, ...averageLabels];

    // Calculates the maximum value of the pokemon's stats
    const maxValue = Math.max(
        d3.max(selectedPokemonStats, d => d.value),
        d3.max(averageStatsData, d => d.value)
    );

    // Initializes the chart
    const chart = d3
        .select("#" + containerId)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Creates the x axis scale    
    const xScale = d3
        .scaleBand()
        .domain(labels)
        .range([0, width])
        .padding(0.2);

    // Creates the y axis scale    
    const yScale = d3
        .scaleLinear()
        .domain([0, maxValue])
        .range([height, 0]);

    // Creates the bars for the graph for the selected pokemon    
    chart
        .selectAll(".bar1")
        .data(selectedPokemonStats)
        .enter()
        .append("rect")
        .attr("class", "bar1")
        .attr("x", d => xScale(d.label))
        .attr("width", xScale.bandwidth() / 2)
        .attr("y", d => yScale(d.value))
        .attr("height", d => height - yScale(d.value))
        .attr("fill", "#f06b6b");

    // Creates the bars for the graph for the average of all pokemon    
    chart
        .selectAll(".bar2")
        .data(averageStatsData)
        .enter()
        .append("rect")
        .attr("class", "bar2")
        .attr("x", d => xScale(d.label))
        .attr("width", xScale.bandwidth() / 2)
        .attr("y", d => yScale(d.value))
        .attr("height", d => height - yScale(d.value))
        .attr("fill", "#6495ed");

    // d3 barchart rendering  
    chart
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));
    // d3 barchart rendering 
    chart
    .append("g")
    .call(d3.axisLeft(yScale));
}

// Makes the searchQuery a global variable
let searchQuery;

// Consts for the chart creation
const width = 400;
const height = 300;
const containerId = "speed_chart";

// Event listener for the search button
document.getElementById("searchForm").addEventListener("submit", () => {
    event.preventDefault();
    searchQuery = document.getElementById("searchInput").value;

    // Calls our search functions at the same time
    Promise.all([fetchPokemonProfile(searchQuery), fetchPokemonStats(searchQuery)])
        .then(([primary_pokemon_data, primary_pokemon_stats]) => {
            console.log(primary_pokemon_data);
            console.log(primary_pokemon_stats);

            // Sets our data as arrays
            const averageStatsData = Object.values(primary_pokemon_stats.average_stats);
            const selectedPokemonStats = Object.values(primary_pokemon_stats.selected_pokemon);

            // Create the comparison chart
            createComparisonChart(selectedPokemonStats, averageStatsData);

            // Creates a function that makes a speed comparison chart
            createSpeedChart(selectedPokemonStats, averageStatsData, width, height, containerId);

            // Creates the speed chart
            createSpeedChart(selectedPokemonStats, averageStatsData, width, height, containerId);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});

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
