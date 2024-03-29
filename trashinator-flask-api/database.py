import sqlite3
from flask import g
import string
import random
import datetime
import time
from flask import Flask
import threading

DATABASE = './sqlite/db/database.db'


# Creates a connection to the DB is it does not already exist and returns it.
def get_db():
    db = getattr(g, '_database', None)

    if db is None:
        db = g._database = sqlite3.connect(DATABASE)

    return db


def does_user_exist(username):
    err = True

    try:
        db = get_db()
        cursor = db.cursor()

        sql_request = f''' SELECT username FROM user WHERE  username = '{username}' '''
        cursor.execute(sql_request)

        if cursor.fetchone() is None:
            err = False

    except sqlite3.Error as e:
        print(e)

    return err


# Tries to add a user to DB and returns 0 if succeeded, 1 otherwise.
def add_user_to_db(username, password, mail_address):
    err = False
    if not does_user_exist(username):
        try:
            db = get_db()
            cursor = db.cursor()

            sql_request = f''' INSERT INTO user (username, password, mail_address, score) 
                        VALUES ('{username}', '{password}', '{mail_address}', 0);'''

            cursor.execute(sql_request)
            db.commit()

            # Fill tokens table with empty values
            sql_request = f''' INSERT INTO tokens (tokens, timestamp) 
            VALUES ("", "");'''
            cursor.execute(sql_request)
            db.commit()

            err = True

        except sqlite3.Error as e:
            print(e)

    return err


def check_user_password_in_db(username, password):
    err = False
    if does_user_exist(username):
        try:
            db = get_db()
            cursor = db.cursor()

            sql_request = f''' SELECT password FROM user WHERE username='{username}'  '''

            cursor.execute(sql_request)

            if password == cursor.fetchone()[0]:
                err = True

        except sqlite3.Error as e:
            print(e)

    return err


def check_user_mail_in_db(mail):
    err = False

    try:
        db = get_db()
        cursor = db.cursor()

        sql_request = f''' SELECT COUNT(mail_address) FROM user WHERE mail_address='{mail}'  '''
        cursor.execute(sql_request)

        if cursor.fetchone()[0] != 0:
            err = True

    except sqlite3.Error as e:
        print(e)

    return err


def get_user_with_username(username):
    if does_user_exist(username):
        try:
            db = get_db()
            cursor = db.cursor()

            sql_request = f''' SELECT user_id, username FROM user WHERE username='{username}'  '''

            cursor.execute(sql_request)
            user = cursor.fetchone()

        except sqlite3.Error as e:
            print(e)

    return user


# Tries to add a scan to DB and returns 0 if succeeded, 1 otherwise.
def add_scan_to_db(user_id, file, confidence, prediction):
    err = True

    try:
        # Insert scan
        db = get_db()
        cursor = db.cursor()

        sql_request = f''' INSERT INTO scan (user_id, file, confidence, prediction) 
                    VALUES ('{user_id}', '{file}','{confidence}', '{prediction}' ); '''

        cursor.execute(sql_request)
        db.commit()

        # Add point to user
        db = get_db()
        cursor = db.cursor()

        sql_request = f''' UPDATE user SET score = score+1 WHERE user_id ='{user_id}'; '''

        cursor.execute(sql_request)
        db.commit()
    except:
        err = False

    return err


def get_user_points(user_id):
    try:
        db = get_db()
        cursor = db.cursor()

        sql_request = f''' SELECT score FROM user WHERE user_id='{user_id}';  '''

        cursor.execute(sql_request)
        return cursor.fetchone()[0]

    except sqlite3.Error as e:
        print(e)


''''''''''''''''''''''''''''''''''''''''''''''''''''''


def update_password(token, password):
    err = False

    if check_token_validity(token):
        try:
            db = get_db()
            cursor = db.cursor()
            sql_request = f''' UPDATE user SET password = '{password}' WHERE user_id = (SELECT tokens_id FROM tokens 
                        WHERE tokens = '{token}'); '''
            cursor.execute(sql_request)
            db.commit()

            # delete used tokens
            sql_request = f''' UPDATE tokens SET timestamp = '', tokens = '' WHERE tokens = '{token}' '''
            cursor.execute(sql_request)
            db.commit()
            err = True

        except sqlite3.Error as e:
            print(e)

    return err


def check_token_validity(token):
    err = False
    try:
        db = get_db()
        cursor = db.cursor()
        sql_request = f''' SELECT tokens_id FROM tokens WHERE tokens = '{token}' '''
        cursor.execute(sql_request)

        if (cursor.fetchone()) is None:
            err = False
        else:
            err = True

    except sqlite3.Error as e:
        print(e)

    return err


def generate_token():
    return ''.join(
        random.SystemRandom().choice(string.ascii_uppercase + string.digits + string.ascii_lowercase) for _ in
        range(128))


def add_token_to_db(mail_address, token):
    err = False
    try:
        timestamp = datetime.datetime.now()
        db = get_db()
        cursor = db.cursor()
        cursor.execute('BEGIN TRANSACTION;')
        sql_request = f''' UPDATE tokens SET tokens = '{token}', timestamp = '{timestamp}' WHERE tokens_id = (SELECT 
                    user_id FROM user WHERE mail_address = '{mail_address}'); '''
        cursor.execute(sql_request)
        cursor.execute('COMMIT;')
        db.commit()

        err = True
    except sqlite3.Error as e:
        print(e)

    return err


def delete_old_tokens():
    while True:
        try:
            app = Flask(__name__)
            app.app_context().push()
            db = get_db()
            cursor = db.cursor()
            filter_time = datetime.datetime.now() - datetime.timedelta(minutes=5)
            sql_request = f''' UPDATE tokens SET timestamp = '', tokens = '' WHERE datetime(timestamp) < '{filter_time}' '''
            cursor.execute(sql_request)
            db.commit()
            cursor.close()

        except sqlite3.Error as e:
            print(e)
            # sleep for 5 minutes

        time.sleep(60)


thread = threading.Thread(target=delete_old_tokens, daemon=True)
thread.start()
