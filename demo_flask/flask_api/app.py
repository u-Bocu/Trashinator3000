from flask import render_template
import connexion

app = connexion.App(__name__, specification_dir="./")
app.add_api("../openapi/swagger.yml")


@app.route("/")
def home():
    return render_template("home.html")


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8080, debug=True)
