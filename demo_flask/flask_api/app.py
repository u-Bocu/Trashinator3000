from flask import render_template, request
from model import get_trash
import os

import connexion


app = connexion.App(__name__, specification_dir="./")
app.add_api("../openapi/swagger.yml")

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

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8080, debug=True)
