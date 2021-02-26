import argparse
import glob
import json
from pathlib import Path
from types import SimpleNamespace
from typing import List

from flask import Flask, render_template



def parse_args() -> SimpleNamespace:
    parser: argparse.ArgumentParser = argparse.ArgumentParser(description="Flask server to view hanabi games.")
    parser.add_argument("game_folder", help="folder in which the games are stored")
    parser.add_argument("--host", type=str, default="0.0.0.0", help="(default: \"0.0.0.0\") the server host")
    parser.add_argument("-d", "--debug", action="store_true", help="(default: False) debug mode")

    return parser.parse_args()

# CONSTANT VARIABLES ==========================================================
GAME_FILE_EXTENSION: str = ".json"
# =============================================================================
# GLOBAL VARIABLES ============================================================
GAMES_FOLDER: str = "."
app: Flask = Flask(__name__)
# =============================================================================

@app.route('/')
def index() -> str:
    path: Path = Path(GAMES_FOLDER)
    filenames: List[str] = []
    for file in path.glob(f"*{GAME_FILE_EXTENSION}"):
        name: str = str(file)
        filename: str = name[name.rfind("/")+1:name.rfind(GAME_FILE_EXTENSION)]
        filenames.append(filename)
    return render_template("index.html", filenames=list(sorted(filenames)))

@app.route('/<filename>')
def show_game(filename):
    path: Path = Path(GAMES_FOLDER).joinpath(filename + GAME_FILE_EXTENSION)
    if not path.exists():
        return f"File:{filename}{GAME_FILE_EXTENSION} does not exist !"
    if not path.is_file():
        return f"File:{filename}{GAME_FILE_EXTENSION} is not a file !"
    json_game_data = {}
    with path.open() as f:
        json_game_data = json.load(f)
    if not json_game_data:
        return f"File:{filename}{GAME_FILE_EXTENSION} is empty !"
    return render_template("game.html", name=filename, json_game_data=json_game_data)

if __name__ == "__main__":
    parameters: SimpleNamespace = parse_args()
    GAMES_FOLDER = parameters.game_folder
    app.run(debug=parameters.debug, host=parameters.host)
