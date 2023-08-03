import sqlite3
from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/pokemon-profile/<int:pokedex_number>', methods=['GET'])
def get_pokemon_profile(pokedex_number):
    conn = sqlite3.connect('sqlite_database\pokemon_db.sqlite')
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM pokemon_data WHERE pokedex_number = ?", (pokedex_number,))
    pokemon_data = cursor.fetchone()

    if not pokemon_data:
        return jsonify({"error": "Pokemon not found"}), 404

    pokemon_profile = {
        "pokedex_number": pokemon_data[1],
        "name": pokemon_data[2],
        "type_1": pokemon_data[9],
        "type_2": pokemon_data[10],
        "abilities": [pokemon_data[13], pokemon_data[14], pokemon_data[15]],
        "hp": pokemon_data[18],
        "attack": pokemon_data[19],
        "defense": pokemon_data[20],
        "sp_attack": pokemon_data[21],
        "sp_defense": pokemon_data[22],
        "speed": pokemon_data[23]
    }

    conn.close()
    return jsonify(pokemon_profile), 200

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

@app.route('/stat-comparison/<int:pokedex_number>', methods=['GET'])
def get_stat_comparison(pokedex_number):
    conn = sqlite3.connect('sqlite_database\pokemon_db.sqlite')
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM pokemon_data WHERE pokedex_number = ?", (pokedex_number,))
    selected_pokemon_data = cursor.fetchone()

    if not selected_pokemon_data:
        return jsonify({"error": "Pokemon not found"}), 404

    cursor.execute("SELECT AVG(hp), AVG(attack), AVG(defense), AVG(sp_attack), AVG(sp_defense), AVG(speed) FROM pokemon_data")
    average_stats = cursor.fetchone()

    stat_comparison = {
        "selected_pokemon": {
            "name": selected_pokemon_data[2],
            "hp": selected_pokemon_data[18],
            "attack": selected_pokemon_data[19],
            "defense": selected_pokemon_data[20],
            "sp_attack": selected_pokemon_data[21],
            "sp_defense": selected_pokemon_data[22],
            "speed": selected_pokemon_data[23]
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

@app.route('/speed-chart/<int:pokedex_number>', methods=['GET'])
def get_speed_chart(pokedex_number):
    conn = sqlite3.connect('sqlite_database\pokemon_db.sqlite')
    cursor = conn.cursor()

    # Fetch the speed for the selected Pokémon from the 'pokemon_data' table
    cursor.execute("SELECT speed FROM pokemon_data WHERE pokedex_number = ?", (pokedex_number,))
    selected_speed = cursor.fetchone()

    # Fetch all speeds from the 'pokemon_data' table
    cursor.execute("SELECT speed FROM pokemon_data")
    all_speeds = cursor.fetchall()

    # Calculate the rank of the selected Pokémon's speed among all Pokémon
    speed_rank = 1
    for speed in all_speeds:
        if speed[0] > selected_speed[0]:
            speed_rank += 1

    # Close the connection
    conn.close()

    speed_chart = {
        'pokedex_number': pokedex_number,
        'selected_speed': selected_speed[0],
        'speed_rank': speed_rank
    }

    return jsonify(speed_chart), 200


@app.route('/catch-rate-comparison/<int:pokedex_number>', methods=['GET'])
def get_catch_rate_comparison(pokedex_number):
    conn = sqlite3.connect('sqlite_database/pokemon_db.sqlite')
    cursor = conn.cursor()

    # Fetch the catch rate of the selected Pokémon from the 'pokemon_data' table
    cursor.execute("SELECT catch_rate, type_1 FROM pokemon_data WHERE pokedex_number = ?", (pokedex_number,))
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
        "pokedex_number": pokedex_number,
        "catch_rate": catch_rate,
        "average_catch_rate_all": average_catch_rate_all,
        "average_catch_rate_same_type": average_catch_rate_same_type
    }

    return jsonify(catch_rate_comparison), 200

@app.route('/pokemon-status/<int:pokedex_number>', methods=['GET'])
def get_pokemon_status(pokedex_number):
    conn = sqlite3.connect('sqlite_database\pokemon_db.sqlite')
    cursor = conn.cursor()

    cursor.execute("SELECT status FROM pokemon_data WHERE pokedex_number = ?", (pokedex_number,))
    status = cursor.fetchone()

    if not status:
        return jsonify({"error": "Pokemon not found"}), 404

    conn.close()
    return jsonify({"status": status[0]}), 200


if __name__ == '__main__':
    app.run(debug=True)
