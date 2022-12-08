#https://flask.palletsprojects.com/en/2.2.x/patterns/fileuploads/

from flask import render_template, request
from werkzeug.utils import secure_filename
from model import get_trash
import os

import connexion


ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

app = connexion.App(__name__, specification_dir="./")
app.add_api("../openapi/swagger.yml")

@app.route("/", methods=['POST'])
def result():
    Message = "Impossible de lire ce type de fichier"
    if request.method == 'POST':
        f = request.files['image']
        if f.filename == '':
            return render_template("home.html", data=Message)
        if f and allowed_file(f.filename):
            filename = secure_filename(f.filename) #So what does that secure_filename() function actually do? Now the problem is that there is that principle called “never trust user input”. This is also true for the filename of an uploaded file. All submitted form data can be forged, and filenames can be dangerous. For the moment just remember: always use that function to secure a filename before storing it directly on the filesystem.
            f.save(os.path.join('demo_flask\\Images', filename))
            conf, data = get_trash(filename)
            return render_template("home.html", data=data, conf=conf)
        else:
            
            return render_template("home.html", data=Message)
             
            
            

@app.route("/")
def home():
    return render_template("home.html")

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8080, debug=True)
