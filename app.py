from types import coroutine
from flask import Flask, request
from index import (getGPAS, getInfo, getCurrentClasses)

app = Flask(__name__)

@app.route("/", methods=["GET"])
def home():
    return "Hello World"


@app.route("/students/gpa", methods=["GET"])
def sendGPAS():
    username, password = request.args.values()

    return getGPAS(username, password)

@app.route("/students/info", methods=["GET"])
def sendInfo():
    username, password = request.args.values()

    return getInfo(username, password)

@app.route("/students/currentclasses", methods=["GET"])
def sendCurrentClasses():
    username, password = request.args.values()

    classes = []

    currentClasses = getCurrentClasses(username, password)
    
    for course in currentClasses:
        classes.append(
            {
                "name" : course.name,
                "grade" : course.grade,
                "weight" : course.weight,
                "credits" : course.credits,
                "assignments" : course.assignments
            }
        )

    return {"currentClasses": classes}