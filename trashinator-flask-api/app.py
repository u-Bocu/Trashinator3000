from flask import Flask, render_template, request
from flask_cors import CORS
from model import get_trash
import os

app = Flask(__name__)
CORS(app)


@app.route("/", methods=['POST'])
def result():
    if request.method == 'POST':
        f = request.files['image']
        f.save(os.path.join('./Images/', f.filename))

        conf, data = get_trash(f.filename)
    return render_template("home.html", data=data, conf=conf)


@app.route("/")
def home():
    return render_template("home.html")


PEOPLE = {
    "Fairy": {
        "fname": "Tooth",
        "lname": "Fairy"
    },
    "Ruprecht": {
        "fname": "Knecht",
        "lname": "Ruprecht"
    },
    "Bunny": {
        "fname": "Easter",
        "lname": "Bunny"
    }
}


@app.route("/api/people", methods=['GET'])
def read_all():
    return list(PEOPLE.values())


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8080, debug=True)
