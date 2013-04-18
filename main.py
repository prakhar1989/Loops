import sqlite3
from flask import Flask, request, jsonify, render_template

# init
music_db = "loops.db"

# update jinja options to use handlebars
class CustomFlask(Flask):
    jinja_options = Flask.jinja_options.copy()
    jinja_options.update(dict(
        # block_start_string='<%',
        # block_end_string='%>',
        variable_start_string='%%',
        variable_end_string='%%',
        comment_start_string='<#',
        comment_end_string='#>',
    ))

app = CustomFlask(__name__)

@app.route('/', methods=["GET"])
def index():
    return render_template("index.html")

@app.route('/songs.json', methods=["GET"])
def get_songs():
    conn = sqlite3.connect(music_db)
    cur = conn.cursor()
    songs_list = [row for row in cur.execute('SELECT * FROM songs')]
    json_results = []
    for song in songs_list:
        json_results.append({ 'title' : song[0],
                              'artist': song[1],
                              'filename': song[2] })
    conn.commit()
    conn.close()
    return jsonify(songs=json_results)

if __name__ == "__main__":
    app.run(debug=True)
