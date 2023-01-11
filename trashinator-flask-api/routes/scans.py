import os
from flask import Blueprint, json, request
from werkzeug.utils import secure_filename
from database import add_scan_to_db, get_db
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
    #j_userdata = request.get_json()
    #userdata = json.load(j_userdata)
    #user_id = userdata.id

    j_userdata = request.get_json();
    data_splitted = j_userdata.get('filePath').split(',')[1]

    fh = open("./Images/imageToSave.png", "wb")
    fh.write(base64.decodebytes(data_splitted.encode()))
    fh.close()

    #filename =  j_userdata.get("filePath")
    user_id = 1; #A envoyé via la post request
    
    res = {
        "success": False,
        "message": "Impossible de lire ce fichier",
        "data": {
            "confidence": None,
            "output": None,
        },
    }

    if request.method == 'POST':
            confidence, prediction = get_trash("imageToSave.png")
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
    
    return j_res


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
