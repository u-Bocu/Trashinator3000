from flask import Blueprint, request
from database import add_user_to_db
from database import check_user_password_in_db
from database import check_user_mail_in_db
from database import generate_token
from database import add_token_to_db
from database import update_password

import smtplib
from email.message import EmailMessage

auth = Blueprint('auth', __name__)


# On a POST request, adds the user to database.
@auth.route("/sign-up", methods=['POST'])
def signup():
    userdata = request.get_json()

    err = add_user_to_db(userdata.get('username'), userdata.get('password'), userdata.get('mail_address'))
    message = "Le nom d'utilisateur n'est plus disponible"

    if err:  # True mean no error
        message = "Login ajouté avec succès"

    res = {
        "success": err,
        "message": message,
        "data": None
    }

    return res


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

    return res


@auth.route("/forgotpassword", methods=['POST'])
def send_mail():
    userdata = request.get_json()

    err = check_user_mail_in_db(userdata.get('mail_address'))
    message = "L'adresse mail n'existe pas dans la base de données"

    if err:
        message = "Un mail contenant un lien re réinitialisation de votre mot de passe à été envoyé à votre adresse " \
                  "mail "

    res = {
        "success": err,
        "message": message,
        "data": None
    }

    token = generate_token()

    if (err):
        to_email = userdata.get('mail_address')
        from_email = 'testsmtpapitse@gmail.com'
        password = 'brlr ahxy luec kyby'
        subject = 'Trashinator : Demande de réinitialisation de votre mot de passe'

        msg = EmailMessage()
        msg.set_content(
            '\nCliquez sur ce lien pour reset votre mot de passe : ' + "http://localhost:4200/reset-password?token=" + token,
            subtype="plain", charset='us-ascii')
        msg['Subject'] = subject
        msg['From'] = from_email
        msg['To'] = to_email

        try:
            server = smtplib.SMTP('smtp.gmail.com', 587)
            server.starttls()
            server.login(from_email, password)
            server.sendmail(from_email, to_email, msg.as_string())
            print('Email sent successfully')
        except:
            print('Error sending email')
        server.quit()

        # Need to add the token into the database
        add_token_to_db(to_email, token)

    return res


@auth.route("/resetpassword", methods=['POST'])
def reset_password():
    userdata = request.get_json()
    err = update_password(userdata.get('token'), userdata.get('password'))

    message = "Impossible de modifier le mot de passe car le token a expiré"

    # If error
    if err:
        message = " Votre mot de passe a été modifié"

    res = {
        "success": err,
        "message": message,
        "data": None
    }

    return res
