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

// Creates a function that searches the api endpoint for pokemon speed stats 
function fetchPokemonSpeed(searchQuery) {
    return fetch(`/speed-chart/${searchQuery}`)
        .then(response => response.json())
}

// Random color function
function random_rgba() {
    let o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')';
}

// Define the function to get labels from an index for our web chart
function getLabelFromIndex(index) {
    const labels = ['Attack', 'Defense', 'HP', 'Special Attack', 'Special Defense', 'Speed'];
    return labels[index] || '';
}

// Global Variables
let random_color = random_rgba();
let comparison_chart = null
let searchQuery;


// Function for drawing our Comparison Radar Chart(Spiderweb Chart)
function createComparisonChart(selectedPokemonStats, averageStatsData, index, labels) {
    anychart.onDocumentReady(function () {

        //console.log(selectedPokemonStats);

        // Checks if there is already a chart and disposes the last one if there is one
        const comparisonChartContainer = document.getElementById("comparison_web");
        comparisonChartContainer.innerHTML = "";

        if (!comparison_chart) {
            comparison_chart = anychart.radar();
        } else {
            comparison_chart.dispose();
            comparison_chart = anychart.radar();
        }


        // Sets the maximum scale for the web graph
        comparison_chart.yScale()
            .minimum(0)
            .maximum(255)
            .ticks({'interval':51});

        // Sets background on the web
        comparison_chart.yGrid().palette(['gray 0.2', 'gray 0.3']);

        // Filter out the 'name' property from selectedPokemonStats and set our array
        const selectedData = selectedPokemonStats
            .filter((_, i) => i !== 3) // Remove the "name" property
            .map((value, i) => {
                const currentIndex = index[i] < labels.length ? index[i] : i; // Reset the index if it goes out of bounds
                return { x: labels[currentIndex], value: value };
            })

        // Creates our average data array
        const averageData = Object.keys(averageStatsData)
            .map((key, index) => ({ x: getLabelFromIndex(index), value: averageStatsData[key]}));

        //console.log(selectedData)
        //console.log(averageData)

        // Puts the data in the spiderweb
        const selectedPokemonSeries = comparison_chart.area(selectedData);
        selectedPokemonSeries.fill(random_color);
        selectedPokemonSeries.stroke('#ff0000');
        selectedPokemonSeries.markers(true);

        const averageStatsSeries = comparison_chart.area(averageData);
        averageStatsSeries.fill('rgba(100, 149, 237, 0.5)');
        averageStatsSeries.stroke('#6495ed');

        // Set the labels for the axes
        comparison_chart.xAxis().labels(labels);
        comparison_chart.yAxis().labels(labels);

        // Titles the graph
        comparison_chart.title(`${selectedPokemonStats[3]}'s Stat Spiderweb`)

        // Attaches it to a div
        comparison_chart.container('comparison_web');

        // Draws the graph
        comparison_chart.draw();
    });
}

// Creates our speed comparison chart
function createSpeedChart(SelectedPokemonSpeedData, averageStatsData, width, height) {
    //console.log(SelectedPokemonSpeedData)
    //console.log(averageStatsData)

    // Clear the previous graph container if it exists
    const speedChartContainer = document.getElementById("speed_chart");
    speedChartContainer.innerHTML = "";

    // Converts the speed stat into a numeric variable
    SelectedPokemonSpeedData[0].speed = +SelectedPokemonSpeedData[0].speed;

    // Variables for our charts/data
    const averageSpeed = averageStatsData[5];

    const averageName = 'All Pokemon Avg.'

    const allNames = [...SelectedPokemonSpeedData.map(data => data.name), averageName];

    // Calculates the maximum value of the pokemon's stats for the chart
    const maxValue = Math.max(
        SelectedPokemonSpeedData[0].speed,
        averageSpeed
    );
    
    // Initializes the chart
    const margin = { top: 20, right: 20, bottom: 50, left: 100 };
    const svg = d3
        .select("#speed_chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);
    const chart = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    // Creates the y axis scale
    const yScale = d3
        .scaleBand()
        .range([0, height])
        .domain(allNames)
        .padding(0.1);
    
    chart.append("g")
        .call(d3.axisLeft(yScale));
    
    // Creates the x axis scale
    const xScale = d3
        .scaleLinear()
        .domain([0, maxValue])
        .range([0, width]);
    
    // Ticks for the x axis
    chart.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale).ticks(5));
    
    // Creates the bars for the graph for the selected pokemon
    chart
        .selectAll(".pokemon-speed")
        .data(SelectedPokemonSpeedData)
        .enter()
        .append("rect")
        .attr("class", "bar1")
        .attr("x", 0)
        .attr("y", d => yScale(d.name) + yScale.bandwidth() / 4)
        .attr("height", yScale.bandwidth() * .5)
        .attr("width", d => xScale(d.speed))
        .attr("fill", random_color);
    
    // Creates the bars for the graph for the average of all pokemon
    chart.append("rect")
        .attr("class", "bar2")
        .attr("x", 0)
        .attr("y", yScale(averageName) + yScale.bandwidth() / 4)
        .attr("height", yScale.bandwidth() * .5)
        .attr("width", xScale(averageSpeed))
        .attr("fill", '#6495ed');

    // Add the title to the chart
    chart.append("text")
        .attr("class", "chart-title")
        .attr("x", width / 2 + margin.left - 110 ) // Center the title horizontally
        .attr("y", margin.top / 2) // Place the title above the chart
        .attr("text-anchor", "middle") // Center the text horizontally
        .text(`${SelectedPokemonSpeedData[0].name}'s Speed Chart`);

    // Add the x-axis title
    chart.append("text")
        .attr("class", "axis-title")
        .attr("x", width / 2 + margin.left -110) // Center the title horizontally
        .attr("y", height + margin.top + margin.bottom / 2) // Place the title below the x-axis
        .attr("text-anchor", "middle") // Center the text horizontally
        .text("Speed");
}

// Event listener for the search button
document.getElementById("searchForm").addEventListener("submit", () => {
    event.preventDefault();
    searchQuery = document.getElementById("searchInput").value;

    // Calls our search functions at the same time to query all our needed data
    Promise.all([fetchPokemonProfile(searchQuery), fetchPokemonStats(searchQuery), fetchPokemonSpeed(searchQuery)])
        .then(([primary_pokemon_data, average_pokemon_stats, pokemon_speed]) => {
            console.log(primary_pokemon_data);
            console.log(average_pokemon_stats);
            console.log(pokemon_speed);
      
            // Sets our data as arrays
            const averageStatsData = Object.values(average_pokemon_stats.average_stats);
            const selectedPokemonStats = Object.values(average_pokemon_stats.selected_pokemon);

            // Sets our Speed data as an array for our graph
            const SelectedPokemonSpeedData = Object.values([{
                name: primary_pokemon_data.name,
                speed: primary_pokemon_data.speed
            }]);

            // Array of labels for comparison chart
            const statLabels = ['Attack', 'Defense', 'HP', 'Special Attack', 'Special Defense', 'Speed'];

            // Create the stat comparison web chart
            createComparisonChart(selectedPokemonStats, averageStatsData, 3, statLabels);

            // Creates speed comparison chart
            createSpeedChart(SelectedPokemonSpeedData, averageStatsData, 400, 400);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

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
