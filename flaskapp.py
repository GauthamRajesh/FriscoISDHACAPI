from flask import Flask, request, abort
from flask_cors import CORS
from index import (getGPAS, getInfo, getCurrentClasses, predictGPA)
from fakeData import *

application = Flask(__name__)
CORS(application)

@application.route("/", methods=["GET"])
def home():
    return "Hello World"

@application.route("/students/gpa", methods=["GET"])
def sendGPAS():
    username, password = request.args.values()

    if(username.lower() == "john" and password.lower() == "doe"):
        return currentGPAS

    return getGPAS(username, password)

@application.route("/students/info", methods=["GET"])
def sendInfo():
    username, password = request.args.values()

    if(username.lower() == "john" and password.lower() == "doe"):
            return studentData

    return getInfo(username, password)

@application.route("/students/currentclasses", methods=["GET"])
def sendCurrentClasses():
    username, password = request.args.values()

    if(username.lower() == "john" and password.lower() == "doe"):
            return currentClasses

    courses = []

    classes = getCurrentClasses(username, password)
    
    for course in classes:
        courses.append(
            {
                "name" : course.name,
                "grade" : course.grade,
                "weight" : course.weight,
                "credits" : course.credits,
                "Last Updated" : course.updateDate,
                "assignments" : course.assignments
            }
        )

    return {"currentClasses": courses}

@application.route("/predictedGPA", methods=["POST"])
def sendPredictedGPA():
    weightedGPA = request.json["weightedGPA"]
    unweightedGPA = request.json["unweightedGPA"]
    studentGrade = request.json["studentGrade"]
    currentClasses = request.json["currentClasses"]

    return (predictGPA(weightedGPA, unweightedGPA, studentGrade, currentClasses))
