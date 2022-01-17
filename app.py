from flask import Flask, request
from index import (getGPAS)

app = Flask(__name__)

@app.route("/", methods=["GET"])
def home():
    return "Hello World"


@app.route("/students/gpa", methods=["GET"])
def returnGPAS():
    args = request.args
    username = args["username"]
    password = args["password"]

    return getGPAS(username, password)
