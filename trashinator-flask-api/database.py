import sqlite3
from flask import g

DATABASE = './sqlite/db/database.db'


# Creates a connection to the DB is it does not already exist and returns it.
def get_db():
    db = getattr(g, '_database', None)

    if db is None:
        db = g._database = sqlite3.connect(DATABASE)

    return db


# Tries to add a user to DB and returns 0 if succeeded, 1 otherwise.
def add_user_to_db(username, password):
    err = True

    try:
        db = get_db()
        cursor = db.cursor()

        sql_request = ''' INSERT INTO user (username, password) 
                    VALUES (''' + username + ''', ''' + password + ''');'''

        cursor.execute(sql_request)
    except:
        err = False

    return err


# Tries to add a scan to DB and returns 0 if succeeded, 1 otherwise.
def add_scan_to_db(user_id, filename, confidence, prediction):
    err = True

    confidence = int(confidence * 100)

    try:
        db = get_db()
        cursor = db.cursor()

        sql_request = ''' INSERT INTO scan (user_id, filename, confidence, prediction) 
                    VALUES (''' + str(user_id) + ''', ''' + filename + ''', ''' + str(
            confidence) + ''', ''' + prediction + ''');'''

        cursor.execute(sql_request)
    except:
        err = False

    return err
