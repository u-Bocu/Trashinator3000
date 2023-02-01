import os
from flask import Blueprint, json, request
from werkzeug.utils import secure_filename
from database import add_scan_to_db, get_db, get_user_points
from model import get_trash
import base64

scans = Blueprint('scans', __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# On a POST request, returns a JSON Object of the prediction if the image is valid.
@scans.route("", methods=['POST'])
def post_scan():
    maListe = []
    j_userdata = request.get_json()
    user_id = j_userdata.get('user_id')

    for i in range(len(j_userdata.get(
            'filePath'))):  # The size of filepath contains the size of the array need to reset the front after sending an image because it's stuck with the old images
        data_splitted = j_userdata.get('filePath')[i].split(',')[1]
        res = {
            "success": False,
            "message": "Impossible de lire ce fichier",
            "data": {
                "confidence": None,
                "output": None,
            },
        }

        # if request.method == 'POST':
        confidence, prediction = get_trash(base64.decodebytes(data_splitted.encode('utf-8')))
        print(confidence, prediction)
        add_scan_to_db(user_id, data_splitted, confidence, prediction)

        res = {
            "success": True,
            "message": "",
            "data": {
                "confidence": confidence,
                "output": prediction,
            },
        }

        j_res = json.dumps(res)
        maListe.append(j_res)  # Concat the json answer before returning the list

    return maListe


# Get all scans or scans from last week
@scans.route("", methods=['GET'])
def get_scans():
    args = request.args
    last_week = args.get("last_week", default=False, type=bool)

    success = True
    message = "Scans récupérés avec succès"
    count = 0
    rows = []

    try:
        db = get_db()
        cursor = db.cursor()

        # All scans or scans from last week
        if last_week:
            sql_request = '''SELECT * FROM scan s WHERE date(s.timestamp) BETWEEN date(current_timestamp, '-6 days') 
                AND date(current_timestamp);'''
        else:
            sql_request = '''SELECT * FROM scan s;'''

        cursor.execute(sql_request)
        rows = cursor.fetchall()
        count = len(rows)
    except:
        success = False
        message = "Erreur lors de la récupération des scans"

    return {
        "success": success,
        "message": message,
        "data": {
            'count': count,
            'rows': rows
        }
    }


# Get number of scans by prediction
@scans.route("/predictions/count", methods=['GET'])
def get_nb_scans_by_prediction():
    success = True
    message = "Nombre de scans par prédiction récupéré avec succès"
    count = 0
    rows = []

    try:
        db = get_db()
        cursor = db.cursor()

        sql_request = '''SELECT prediction, count(*) FROM scan s GROUP BY s.prediction;'''

        cursor.execute(sql_request)
        rows = cursor.fetchall()
        count = len(rows)
    except:
        success = False
        message = "Erreur lors de la récupération du nombre de scans par prédiction"

    return {
        "success": success,
        "message": message,
        "data": {
            'count': count,
            'rows': rows
        }
    }


# Get number of scans by prediction by user
@scans.route("/predictions/count", methods=['POST'])
def get_nb_scans_by_prediction_by_user():
    j_userdata = request.get_json()
    user_id = j_userdata.get('user_id')

    success = True
    message = "Nombre de scans par prédiction récupéré avec succès"
    count = 0
    rows = []

    try:
        db = get_db()
        cursor = db.cursor()

        sql_request = f'''SELECT prediction, count(*) FROM scan s WHERE user_id='{user_id}' GROUP BY s.prediction;'''

        cursor.execute(sql_request)
        rows = cursor.fetchall()
        count = len(rows)
    except:
        success = False
        message = "Erreur lors de la récupération du nombre de scans par prédiction"

    return {
        "success": success,
        "message": message,
        "data": {
            'count': count,
            'rows': rows
        }
    }


# Get number of all scans by day or scans by day from last week
@scans.route("/count", methods=['GET'])
def get_nb_scans_by_day():
    args = request.args
    last_week = args.get("last_week", default=False, type=bool)

    success = True
    message = "Nombre de scans par jour récupéré avec succès"
    count = 0
    rows = []

    try:
        db = get_db()
        cursor = db.cursor()

        # Count all scans or scans from last week
        if last_week:
            sql_request = '''SELECT strftime('%d', `timestamp`) day, strftime('%w', `timestamp`), count(*) FROM scan s
                WHERE date(s.timestamp) BETWEEN date(current_timestamp, '-6 days') AND date(current_timestamp)
                GROUP BY day;'''
        else:
            sql_request = '''SELECT strftime('%d', `timestamp`) day, strftime('%w', `timestamp`), count(*) FROM scan s 
                GROUP BY day;'''

        cursor.execute(sql_request)
        rows = cursor.fetchall()
        count = len(rows)
    except:
        success = False
        message = "Erreur lors de la récupération du nombre de scans par jour"

    return {
        "success": success,
        "message": message,
        "data": {
            'count': count,
            'rows': rows
        }
    }


# Get number of all scans by day or scans by day from last week by user
@scans.route("/count/user", methods=['GET'])
def get_nb_scans_by_day_by_user():
    args = request.args
    last_week = args.get("last_week", default=False, type=bool)
    user_id = args.get("user_id", default='', type=int)

    success = True
    message = "Nombre de scans par jour récupéré avec succès"
    count = 0
    rows = []

    try:
        db = get_db()
        cursor = db.cursor()

        # Count all scans or scans from last week
        if last_week:
            sql_request = f'''SELECT strftime('%d', `timestamp`) day, strftime('%w', `timestamp`), count(*) FROM scan s
                WHERE (date(s.timestamp) BETWEEN date(current_timestamp, '-6 days') AND 
                date(current_timestamp)) AND s.user_id = '{user_id}' GROUP BY day; '''
        else:
            sql_request = f'''SELECT strftime('%d', `timestamp`) day, strftime('%w', `timestamp`), count(*) FROM scan s 
                WHERE s.user_id = '{user_id}' GROUP BY day;'''

        cursor.execute(sql_request)
        rows = cursor.fetchall()
        print(rows)
        count = len(rows)
    except:
        success = False
        message = "Erreur lors de la récupération du nombre de scans par jour"

    return {
        "success": success,
        "message": message,
        "data": {
            'count': count,
            'rows': rows
        }
    }


# Get user's score
@scans.route("/points", methods=['POST'])
def post_points():
    j_userdata = request.get_json()
    user_id = j_userdata.get('user_id')

    return {
        "success": True,
        "message": "",
        "data": get_user_points(user_id)
    }
