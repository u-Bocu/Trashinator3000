# https://flask.palletsprojects.com/en/2.2.x/patterns/fileuploads/
# Need to launch the server first

from flask import Flask, g
from flask_cors import CORS
from routes.auth import auth
from routes.scans import scans
from routes.global_data import global_data

app = Flask(__name__)
app.register_blueprint(scans, url_prefix='/api/scans')
app.register_blueprint(auth, url_prefix='/api/auth')
app.register_blueprint(global_data, url_prefix='/api/global_data')

CORS(app)


# Closes the connection to DB if not already done.
@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)

    if db is not None:
        db.close()


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8080, debug=True)  # Enlever le debug true
