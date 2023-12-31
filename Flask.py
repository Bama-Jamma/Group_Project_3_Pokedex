import sqlite3
from flask import Flask, jsonify, request, render_template
from flask_cors import CORS, cross_origin
import urllib.parse

app = Flask(__name__, template_folder="../Group_Project_3_Pokedex")
CORS(app)
# Returns the home page html
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/pokemon-profile/<int:pokedex_number>', methods=['GET'])
def get_pokemon_profile(pokedex_number):
    return get_pokemon_variation_profile(pokedex_number, None)

@app.route('/pokemon-profile/<int:pokedex_number>/<path:variation>', methods=['GET'])
def get_pokemon_variation_profile(pokedex_number, variation):
    conn = sqlite3.connect('sqlite_database/pokemon_db.sqlite')
    cursor = conn.cursor()

    # Construct the query to fetch the Pokémon data based on variation
    query = "SELECT * FROM pokemon_data WHERE pokedex_number = ?"
    params = (pokedex_number,)

    if variation:
        query += " AND name = ?"
        params += (variation,)

    cursor.execute(query, params)
    pokemon_data = cursor.fetchone()

    conn.close()

    if not pokemon_data:
        return jsonify({"error": "Pokemon not found"}), 404

    # Construct and return the Pokémon profile
    pokemon_profile = {
           "pokedex_number": pokemon_data[0],
        "name": pokemon_data[1],
        "type_1": pokemon_data[7],
        "type_2": pokemon_data[8],
        "abilities": [pokemon_data[12], pokemon_data[13], pokemon_data[14]],
        "hp": pokemon_data[16],
        "attack": pokemon_data[17],
        "defense": pokemon_data[18],
        "sp_attack": pokemon_data[19],
        "sp_defense": pokemon_data[20],
        "speed": pokemon_data[21]
        # Include other attributes here
    }

    return jsonify(pokemon_profile), 200

@app.route('/pokemons/', methods=['GET'])
def get_pokemons():

    conn = sqlite3.connect('sqlite_database\pokemon_db.sqlite')
    cursor = conn.cursor()
    cursor.execute("SELECT pokedex_number, name FROM pokemon_data")
    pokemon_data = cursor.fetchall()

    pokemons = []

    for row in pokemon_data:
        pokemons.append({'pokemon_index_number':row[0],'name':row[1]})

    all_pokemons  = {
        "pokemons": pokemons
    }

    conn.close()
    
    return jsonify(all_pokemons)


@app.route('/move-distribution/<int:pokedex_number>', methods=['GET'])
def get_move_distribution(pokedex_number):
    conn = sqlite3.connect('sqlite_database\pokemon_db.sqlite')
    cursor = conn.cursor()

    cursor.execute("SELECT ability_1, ability_2, ability_hidden FROM pokemon_data WHERE pokedex_number = ?", (pokedex_number,))
    moves = cursor.fetchone()

    if not moves:
        return jsonify({"error": "Pokemon not found or no moves available"}), 404

    # Filter out any NULL values in the moves list
    moves = [move for move in moves if move]

    move_distribution = {}
    for move in moves:
        if move in move_distribution:
            move_distribution[move] += 1
        else:
            move_distribution[move] = 1

    conn.close()
    return jsonify(move_distribution), 200


@app.route('/stat-comparison/<int:pokedex_number>/', methods=['GET'])
@app.route('/stat-comparison/<int:pokedex_number>/<variation>/', methods=['GET'])
def get_stat_comparison(pokedex_number, variation=None):
    conn = sqlite3.connect('sqlite_database/pokemon_db.sqlite')
    cursor = conn.cursor()

    if variation is None:
        cursor.execute("SELECT * FROM pokemon_data WHERE pokedex_number = ?", (pokedex_number,))
    else:
        cursor.execute("SELECT * FROM pokemon_data WHERE pokedex_number = ? AND name = ?", (pokedex_number, variation))

    selected_pokemon_data = cursor.fetchone()

    if not selected_pokemon_data:
        conn.close()
        return jsonify({"error": "Pokemon not found"}), 404

    cursor.execute("SELECT AVG(hp), AVG(attack), AVG(defense), AVG(sp_attack), AVG(sp_defense), AVG(speed) FROM pokemon_data")
    average_stats = cursor.fetchone()

    stat_comparison = {
        "selected_pokemon": {
            "name": selected_pokemon_data[1],
            "hp": selected_pokemon_data[16],
            "attack": selected_pokemon_data[17],
            "defense": selected_pokemon_data[18],
            "sp_attack": selected_pokemon_data[19],
            "sp_defense": selected_pokemon_data[20],
            "speed": selected_pokemon_data[21]
        },
        "average_stats": {
            "hp": average_stats[0],
            "attack": average_stats[1],
            "defense": average_stats[2],
            "sp_attack": average_stats[3],
            "sp_defense": average_stats[4],
            "speed": average_stats[5]
        }
    }

    conn.close()
    return jsonify(stat_comparison), 200


    
@app.route('/catch-rate-comparison/<int:pokedex_number>', methods=['GET'])
@app.route('/catch-rate-comparison/<int:pokedex_number>/<variation>', methods=['GET'])
def get_catch_rate_comparison(pokedex_number, variation=None):
    conn = sqlite3.connect('sqlite_database/pokemon_db.sqlite')
    cursor = conn.cursor()

    if variation is None:
        # If no variation is specified, retrieve the base Pokémon data
        cursor.execute("SELECT catch_rate, type_1 FROM pokemon_data WHERE pokedex_number = ?", (pokedex_number,))
    else:
        # If a variation is specified, retrieve the corresponding variation data
        cursor.execute("SELECT catch_rate, type_1 FROM pokemon_data WHERE pokedex_number = ? AND name = ?", (pokedex_number, variation))

    pokemon_data = cursor.fetchone()

    if not pokemon_data:
        return jsonify({"error": "Pokemon not found"}), 404

    catch_rate = pokemon_data[0]
    pokemon_type = pokemon_data[1]

    # Fetch the average catch rate of all Pokémon from the 'pokemon_data' table
    cursor.execute("SELECT AVG(catch_rate) FROM pokemon_data")
    average_catch_rate_all = cursor.fetchone()[0]

    # Fetch the average catch rate of Pokémon with the same type as the selected Pokémon
    cursor.execute("SELECT AVG(catch_rate) FROM pokemon_data WHERE type_1 = ?", (pokemon_type,))
    average_catch_rate_same_type = cursor.fetchone()[0]

    conn.close()

    catch_rate_comparison = {
        "catch_rate": catch_rate,
        "average_catch_rate_all": average_catch_rate_all,
        "average_catch_rate_same_type": average_catch_rate_same_type
    }

    return jsonify(catch_rate_comparison), 200

@app.route('/speed-chart/<int:pokedex_number>/', methods=['GET'])
@app.route('/speed-chart/<int:pokedex_number>/<pokemon_name>/', methods=['GET'])
def get_speed_chart(pokedex_number, pokemon_name=None):
    conn = sqlite3.connect('sqlite_database/pokemon_db.sqlite')
    cursor = conn.cursor()

    if pokemon_name is None:
        # If no variation is specified, retrieve the base Pokémon data
        cursor.execute("SELECT speed FROM pokemon_data WHERE pokedex_number = ?", (pokedex_number,))
    else:
        # If a variation is specified, retrieve the corresponding variation data
        cursor.execute("SELECT speed FROM pokemon_data WHERE pokedex_number = ? AND name = ?", (pokedex_number, pokemon_name))

    selected_speed = cursor.fetchone()

    if not selected_speed:
        conn.close()
        return jsonify({"error": "Pokemon not found"}), 404

    cursor.execute("SELECT speed FROM pokemon_data")
    all_speeds = cursor.fetchall()

    speed_rank = 1
    for speed in all_speeds:
        if speed[0] > selected_speed[0]:
            speed_rank += 1

    conn.close()

    speed_chart = {
        'pokedex_number': pokedex_number,
        'selected_speed': selected_speed[0],
        'speed_rank': speed_rank
    }

    return jsonify(speed_chart), 200



if __name__ == '__main__':
    app.run(port=8000, debug=True)

