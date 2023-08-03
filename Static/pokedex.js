fetch('/pokemon-profile/<int:pokedex_number>')
    .then(response => response.json())
    .then(primary_pokemon_data => {
        console.log(primary_pokemon_data);
        

        fetch('/stat-comparison/<int:pokedex_number>')
        .then(response => response.json())
        .then(primary_pokemon_stats => {
            console.log(primary_pokemon_stats);
        
        const averageStats = primary_pokemon_stats.average_stats;
        const primaryStats = primary_pokemon_stats.selected_pokemon;

        const averageStatsData = Object.values(averageStats);
        const selectedPokemonStats = Object.values(primaryStats)


            // Function for drawing our Comparison Radar Chart(Spiderweb Chart)
            anychart.onDocumentReady(function () {
                let comparison_chart = anychart.radar();

                // Sets the maximum scale for the web graph
                comparison_chart.yScale()
                    .minimum(0)
                    .maximum(130)
                    .ticks({'interval':10});

                // Sets background
                comparison_chart.yGrid().pallete(['gray 0.2', 'gray 0.3']);

                // Creates the data in the spiderweb
                comparison_chart.area(selectedPokemonStats).name(primary_pokemon_data.name).markers(true).fill('#f06b6b').stroke('#ff0000');
                comparison_chart.area(averageStatsData).markers(true).fill('#6495ed').stroke('#6495ed').fillOpacity(0.5);
                

                // Titles the graph
                comparison_chart.title('Pokemon Comparison Graph')
                    .legend(true);
                
                // Attaches it to a div
                comparison_chart.container('comparison_web');

                // Draws the graph
                comparison_chart.draw();
        });
});

    })
    // Handles errors
    .catch(error => {
        console.error('Error fetching data', error);
})





