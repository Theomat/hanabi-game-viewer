# hanabi-game-viewer

A website that displays hanabi games.
The website (Github Pages) can be accessed [here](https://theomat.github.io/hanabi-game-viewer/).


## Server

A Python server running with [Flask](https://github.com/pallets/flask) can be started with:
```bash
python server/hanabi_viewer.py game_logs
```
It will display the games found in the folder ```game_logs```.

It is the generated HTML files that are used for the static Github pages.


## Generate static HMTL files

Running 
```
sh produce_static_files.sh
```
will automatically generate the static HTML files for the games located in the ```game_logs``` folder.

Note that you need to manually add them to the ```index.html```.
