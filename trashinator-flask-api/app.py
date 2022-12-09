#https://flask.palletsprojects.com/en/2.2.x/patterns/fileuploads/

from flask import Flask, render_template, request
from flask_cors import CORS
from werkzeug.utils import secure_filename
from model import get_trash
import os
import json

from database import *

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

app = Flask(__name__)
CORS(app)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# On a POST request, adds the user to database.
@app.route("/login", methods=['POST'])
def login():
    j_userdata = request.get_json()
    userdata = json.load(j_userdata)

    err = add_user_to_db(userdata.username, userdata.password)
    message = "Impossible de login cet utilisateur"

    if err:
        message = "Login ajouté avec succès"

    res = {
        "success" : err,
        "message" : message,
        "data" : None
    }

# On a POST request, returns a JSON Object of the prediction if the image is valid.
@app.route("/", methods=['POST'])
def result():
    j_userdata = request.get_json()
    userdata = json.load(j_userdata)
    user_id = userdata.id

    res = {
        "success" : False,
        "message" : "Impossible de lire ce fichier",
        "data" : {
            "confidence" : None,
            "output" : None,
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
                "success" : True,
                "message" : "",
                "data" : {
                    "confidence" : confidence,
                    "output" : prediction,
                },
            }

    j_res = json.dumps(res)
    return j_res 
            

@app.route("/")
def home():
    return render_template("home.html")

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8080, debug=True)
