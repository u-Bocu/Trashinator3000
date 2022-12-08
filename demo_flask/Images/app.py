from flask import Flask, render_template




def test():
    for i in range(10):
        print("Test")

test()
app = Flask(__name__)

@app.route("/")
def table():
    data = (
    ('A','t','t'),
    ('t','t','t'),
    ('t','t','t'),
    ('A','t','t'),
    ('t','t','t'),
    ('A','t','t'),
    ('t','t','t')
)
    image = ('4gb4y0lp47b91.jpg','img.png')

    return render_template("index.html", data=data, filename=image)









