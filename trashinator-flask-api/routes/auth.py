from flask import Blueprint, request, json
from database import add_user_to_db

auth = Blueprint('auth', __name__)


# On a POST request, adds the user to database.
@auth.route("/login", methods=['POST'])
def login():
    j_userdata = request.get_json()
    userdata = json.load(j_userdata)

    err = add_user_to_db(userdata.username, userdata.password)
    message = "Impossible de login cet utilisateur"

    if err:
        message = "Login ajouté avec succès"

    res = {
        "success": err,
        "message": message,
        "data": None
    }
