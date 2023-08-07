import sqlite3
from flask import Flask, jsonify
import flask_cors as cors

app = Flask(__name__)

@app.route('/pokemon-profile/<int:pokedex_number>/<variation>', methods=['GET'])
def get_pokemon_profile(pokedex_number, variation):
    conn = sqlite3.connect('sqlite_database/pokemon_db.sqlite')
    cursor = conn.cursor()

    # Fetch the Pokémon data for the selected variation from the 'pokemon_data' table
    cursor.execute("SELECT * FROM pokemon_data WHERE pokedex_number = ?", (pokedex_number,))
    all_pokemon_data = cursor.fetchall()

    selected_pokemon_data = None
    for pokemon_data in all_pokemon_data:
        if variation.lower() in pokemon_data[2].lower():
            selected_pokemon_data = pokemon_data
            break

    if not selected_pokemon_data:
        return jsonify({"error": "Pokemon not found"}), 404

    pokemon_profile = {
        "pokedex_number": selected_pokemon_data[1],
        "name": selected_pokemon_data[2],
        "type_1": selected_pokemon_data[9],
        "type_2": selected_pokemon_data[10],
        "abilities": [selected_pokemon_data[13], selected_pokemon_data[14], selected_pokemon_data[15]],
        "hp": selected_pokemon_data[18],
        "attack": selected_pokemon_data[19],
        "defense": selected_pokemon_data[20],
        "sp_attack": selected_pokemon_data[21],
        "sp_defense": selected_pokemon_data[22],
        "speed": selected_pokemon_data[23]
    }

    conn.close()
    return jsonify(pokemon_profile), 200

@app.route('/catch-rate-comparison/<int:pokedex_number>/<variation>', methods=['GET'])
def get_catch_rate_comparison(pokedex_number, variation):
    conn = sqlite3.connect('sqlite_database/pokemon_db.sqlite')
    cursor = conn.cursor()

    # Fetch the Pokémon data for the selected variation from the 'pokemon_data' table
    cursor.execute("SELECT * FROM pokemon_data WHERE pokedex_number = ?", (pokedex_number,))
    all_pokemon_data = cursor.fetchall()

    selected_pokemon_data = None
    for pokemon_data in all_pokemon_data:
        if variation.lower() in pokemon_data[2].lower():
            selected_pokemon_data = pokemon_data
            break

    if not selected_pokemon_data:
        return jsonify({"error": "Pokemon not found"}), 404

    catch_rate = selected_pokemon_data[16]
    pokemon_type = selected_pokemon_data[9]

    # Fetch the average catch rate of all Pokémon from the 'pokemon_data' table
    cursor.execute("SELECT AVG(catch_rate) FROM pokemon_data")
    average_catch_rate_all = cursor.fetchone()[0]

    # Fetch the average catch rate of Pokémon with the same type as the selected Pokémon
    cursor.execute("SELECT AVG(catch_rate) FROM pokemon_data WHERE type_1 = ?", (pokemon_type,))
    average_catch_rate_same_type = cursor.fetchone()[0]

    conn.close()

    catch_rate_comparison = {
        "pokedex_number": pokedex_number,
        "name": selected_pokemon_data[2],
        "catch_rate": catch_rate,
        "average_catch_rate_all": average_catch_rate_all,
        "average_catch_rate_same_type": average_catch_rate_same_type
    }

    return jsonify(catch_rate_comparison), 200

if __name__ == '__main__':
    app.run(debug=True)

