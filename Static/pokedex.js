// Fetches data from the our api for a selected pokemon
fetch('/pokemon-profile/<int:pokedex_number>')
    .then(response => response.json())
    .then(primary_pokemon_data => {
        console.log(primary_pokemon_data);
        
        // Fetches the stats of a selected pokemon and the average pokemon
        fetch('/stat-comparison/<int:pokedex_number>')
            .then(response => response.json())
            .then(primary_pokemon_stats => {
                console.log(primary_pokemon_stats);
            
                // Sets our data as arrays
                const averageStats = primary_pokemon_stats.average_stats;
                const primaryStats = primary_pokemon_stats.selected_pokemon;

                const averageStatsData = Object.values(averageStats);
                const selectedPokemonStats = Object.values(primaryStats);


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
                
                // Creates a function that makes a speed comparison chart
                function createSpeedChart(selectedPokemonStats, averageStatsData, width, height, containerId) {
                    const allData = [selectedPokemonStats, averageStatsData];
                    const labels = allData.map(data => data.label);
                      
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
                // Consts for the chart creation      
                const width = 400;
                const height = 300;
                const containerId = "speed_chart";
                
                // Creates the chart
                createSpeedChart(selectedPokemonStats, averageStatsData, width, height, containerId);
            })
            // Handles errors
            .catch(error => {
                console.error('Error fetching data', error);
            });
    })
    // Handles errors
    .catch(error => {
        console.error('Error fetching data', error);
    });
