import eyed3
import os
import sqlite3

# config
music_db = "loops.db"

def execSql(statement, items=None):
    conn = sqlite3.connect(music_db)
    cur = conn.cursor()
    if items:
        cur.executemany(statement, items)
    else:
        cur.execute(statement)
    conn.commit()
    conn.close()

def init_db():
    statement = '''CREATE TABLE SONGS
                (title text, artist text, filename text)'''
    execSql(statement)
    print "------------ %s DB created ------------" % (music_db)

def add_songs(songs_dir):
    current_dir = os.path.dirname(os.path.abspath(__file__))
    songs_path = os.path.join(current_dir, songs_dir)
    songs = os.listdir(songs_path)
    songs_info = []
    print "------------ adding songs ------------"
    for song in songs:
        audiofile = eyed3.load(os.path.join(songs_path, song))
        songs_info.append((audiofile.tag.title,
                           audiofile.tag.artist,
                           "/" + songs_dir + song)) #TODO: Hack? :(

    statement = "INSERT INTO SONGS VALUES (?, ?, ?)"
    execSql(statement, songs_info)
    print "------------ %s songs added ------------" % len(songs_info)

def clear_db():
    statement = "DELETE FROM SONGS"
    print "------------ SONGS TABLE CLEARED ------------"
    execSql(statement)

if __name__ == "__main__":
    songs_dir = "static/songs/"
    init_db()
    add_songs(songs_dir)
