# LOOPS
> Play | Pause | Repeat

Loops is a first attempt at making a Single Page Web App (SPA) built using JS, Backbone and Flask (python).
Started as an experiment to learn HTML5 Audio it quickly turned into a music player with a slew of handy features like cross-browser support, keyboard shortcuts, playlist functionality and live display of artist and track info.
Loops can be used a replacement for your desktop music player if you're geeky enough to get it up and running. Future versions of this player will be packed with more features that will add support for large libraries.

### Dependancies
- Flask
- eyeD3 (for reading ID3 tags)

### Contributors
- [Prakhar Srivastav](https://github.com/prakhar1989)
- [Shashank Srivastav](https://github.com/shashankgroovy)

### Usage and Installation
- Step 0 - `pip install eyed3`
- Step 1 - Create a db of songs. Open the file `create_db.py` and change the 
`songs_dir` to point to your music directory. Now run the script
``` python add_songs.py ```
If this has proceeded with no errors, you'll see a `loops.db` file in your 
directory
- Step 2 - Deploy this app on a server of your choice and voila!

### Screenshots
![Image](https://dl.dropboxusercontent.com/u/9555677/loops/song3.png)
![Image](https://dl.dropboxusercontent.com/u/9555677/loops/song2.png)
![Image](https://dl.dropboxusercontent.com/u/9555677/loops/song1.png)

