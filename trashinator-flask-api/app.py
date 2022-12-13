# https://flask.palletsprojects.com/en/2.2.x/patterns/fileuploads/

from flask import Flask, g
from flask_cors import CORS
from routes.auth import auth
from routes.scans import scans

app = Flask(__name__)
app.register_blueprint(scans, url_prefix='/api/scans')
app.register_blueprint(auth, url_prefix='/api/auth')
CORS(app)


# Closes the connection to DB if not already done.
@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)

    if db is not None:
        db.close()


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8080, debug=True)
