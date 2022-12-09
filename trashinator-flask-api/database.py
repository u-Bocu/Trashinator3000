import sqlite3
from flask import g
from app import *

DATABASE = '/sqlite/database.db'

# Creates a connection to the DB is it does not already exist and returns it.
def get_db():
    db = getattr(g, '_database', None)

    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    
    return db

# Closes the connection to DB if not already done.
@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)

    if db is not None:
        db.close()