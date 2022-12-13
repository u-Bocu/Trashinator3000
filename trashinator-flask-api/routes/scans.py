import os
from flask import Blueprint, json, request
from werkzeug.utils import secure_filename
from database import add_scan_to_db, get_db
from model import get_trash

scans = Blueprint('scans', __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# On a POST request, returns a JSON Object of the prediction if the image is valid.
@scans.route("/", methods=['POST'])
def result():
    j_userdata = request.get_json()
    userdata = json.load(j_userdata)
    user_id = userdata.id

    res = {
        "success": False,
        "message": "Impossible de lire ce fichier",
        "data": {
            "confidence": None,
            "output": None,
        },
    }

    if request.method == 'POST':
        file = request.files['image']

        if file.filename != '' \
                and file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join('demo_flask\\Images', filename))

            confidence, prediction = get_trash(filename)
            add_scan_to_db(user_id, filename, confidence, prediction)

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


# Get all scans with filters
@scans.route("/", methods=['GET'])
def get_scans():
    success = True
    message = "Scans récupérés avec succès"
    count = 0
    rows = []

    try:
        db = get_db()
        cursor = db.cursor()

        sql_request = '''SELECT * FROM scan;'''

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
