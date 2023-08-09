# Pokedex Data Visualization Project

Welcome to the Pokedex Data Visualization Project! This project aims to provide an interactive way to explore Pokemon data through visualizations. It utilizes a Flask API to retrieve data from an SQLite database and presents it using HTML, JavaScript, and D3.js for visually appealing charts.

## Summary

The Pokedex Data Visualization Project allows users to select a Pokemon and view detailed information about it, including its profile, statistics, and speed. The project's main features include:

- **Pokemon Profile**: Retrieve essential information about a selected Pokemon, such as its name, type, and abilities.

- **Stat Comparison**: Compare the selected Pokemon's statistics (HP, Attack, Defense, etc.) with the average statistics of all Pokemon.

- **Speed Chart**: Visualize the speed of the selected Pokemon in comparison to other Pokemon.

## Data Sources

The project's data is sourced from the following datasets:

- [Pokemon Dataset on Kaggle](https://www.kaggle.com/rounakbanik/pokemon): Provides comprehensive information about various aspects of Pokemon, including profiles and statistics.
- [Pokemon Images Dataset on Kaggle](https://www.kaggle.com/datasets/kvpratama/pokemon-images-dataset): Offers a collection of Pokemon images for visualization purposes.

## Libraries Used

- Flask: A micro web framework for building the API backend.
- D3.js: A JavaScript library for creating data visualizations in web browsers.
- SQLite: A lightweight database engine for storing and retrieving Pokemon data.

## Using the API

To access the data through the API, follow these steps:

1. Clone the repository to your local machine.
2. Set up a virtual environment (recommended) and install the required packages using `pip install -r requirements.txt`.
3. Start the Flask server using `flask run`.
4. Access the API and visualizations by opening your web browser and navigating to `http://127.0.0.1:8000`.

## API Endpoints

- `/pokemons`: Retrieves a list of all available Pokemon index numbers and names.
- `/pokemon-profile/<int:pokedex_number>`: Retrieves the profile data of a Pokemon based on its index number.
- `/pokemon-profile/<int:pokedex_number>/<variation>`: Retrieves the profile data of a specific variation of a Pokemon.
- `/stat-comparison/<int:pokedex_number>`: Compares the selected Pokemon's stats with average stats of all Pokemon.
- `/stat-comparison/<int:pokedex_number>/<variation>`: Compares the stats of a specific variation of a Pokemon with average stats.
- `/speed-chart/<int:pokedex_number>`: Displays a speed comparison chart for the selected Pokemon.
- `/speed-chart/<int:pokedex_number>/<variation>`: Displays a speed comparison chart for a specific variation of a Pokemon.

## Conclusion

The Pokedex Data Visualization Project offers an engaging and informative way to explore the world of Pokemon. Whether you're curious about a specific Pokemon's characteristics or interested in comparing stats and speed, this project provides an interactive experience for both fans and data enthusiasts.
