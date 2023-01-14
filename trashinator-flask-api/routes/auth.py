from flask import Blueprint, request, json
from database import add_user_to_db 
from database import check_user_password_in_db

auth = Blueprint('auth', __name__)


# On a POST request, adds the user to database.
@auth.route("/sign-up", methods=['POST'])
def signup():
    userdata = request.get_json()

    err = add_user_to_db(userdata.get('username'), userdata.get('password'))
    message = "Impossible d'insérer cet utilisateur dans la base de données"

    if err:
        message = "Login ajouté avec succès"
    
    res = {
        "success": err,
        "message": message,
        "data": None
    }

    return res;


@auth.route("/login", methods=['POST'])
def login():
    userdata = request.get_json()
    
    err = check_user_password_in_db(userdata.get('username'), userdata.get('password'))
    message = "Vérifiez votre identifiant ou votre mot de passe"

    if err:
        message = "Connexion réussis avec Succès"
    
    res = {
        "success": err,
        "message": message,
        "data": None
    }

    return res;
    
