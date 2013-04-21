import eyed3
import os
import sqlite3

# config
music_db = "loops.db"

def init_db(songs_dir):
    conn = sqlite3.connect(music_db)
    cur = conn.cursor()
    result = cur.execute("select count(name) from sqlite_master where name = 'SONGS'").fetchone()
    if result[0] == 0:
        statement = '''CREATE TABLE SONGS (title text, artist text, filename text)'''
    else:
        statement = '''DELETE FROM SONGS'''
    cur.execute(statement)
    print "------------ %s DB created ------------" % (music_db)

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

    cur.executemany("INSERT INTO SONGS VALUES (?, ?, ?)", songs_info)
    print "------------ %s songs added ------------" % len(songs_info)
    conn.commit()
    conn.close()

if __name__ == "__main__":
    songs_dir = "static/songs/"
    init_db(songs_dir)
