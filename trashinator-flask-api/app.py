#https://flask.palletsprojects.com/en/2.2.x/patterns/fileuploads/

from flask import Flask, render_template, request
from flask_cors import CORS
from werkzeug.utils import secure_filename
from model import get_trash
import os
import json

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

app = Flask(__name__)
CORS(app)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/", methods=['POST'])
# On a POST request, returns a JSON Object of the prediction if the image is valid.
def result():

    res = {
        "success" : False,
        "message" : "Impossible de lire ce fichier",
        "data" : {
            "output" : None,
            "confidence" : None,
        },
    }

    if request.method == 'POST':
        file = request.files['image']

        if file.filename != '' \
            and file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join('demo_flask\\Images', filename))

            conf, data = get_trash(filename)

            res = {
                "success" : True,
                "message" : "",
                "data" : {
                    "output" : data,
                    "confidence" : conf,
                },
            }

    j_res = json.dumps(res)
    return j_res 
            

@app.route("/")
def home():
    return render_template("home.html")

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8080, debug=True)
