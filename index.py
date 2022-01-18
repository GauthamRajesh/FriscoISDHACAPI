from course import Course
from utils import *

#Get current student GPAs from their transcript
def getGPAS(username, password):
    transcriptDOM = getPage(username, password, TRANSCRIPT_URL)
    
    parser = createBS4Parser(transcriptDOM.text)
    weightedGPA = parser.find(id="plnMain_rpTranscriptGroup_lblGPACum1").text
    unWeightedGPA = parser.find(id="plnMain_rpTranscriptGroup_lblGPACum2").text

    return {
        "weightedGPA": weightedGPA,
        "unweightedGPA": unWeightedGPA
    }

#Get student info
def getInfo(username, password):
    registrationDOM = getPage(username, password, REGISTRATION_URL)

    parser = createBS4Parser(registrationDOM.text)
    studentID = parser.find(id="plnMain_lblRegStudentID").text
    studentName = parser.find(id="plnMain_lblRegStudentName").text
    studentBirthDate = parser.find(id="plnMain_lblBirthDate").text
    studentCounselor = parser.find(id="plnMain_lblCounselor").text
    studentBuilding = parser.find(id="plnMain_lblBuildingName").text
    studentGrade = parser.find(id="plnMain_lblGrade").text

    return {
        "name" : studentName,
        "id" : studentID,
        "grade" : studentGrade, 
        "birthdate" : studentBirthDate,
        "campus" : studentBuilding,
        "counselor" : studentCounselor
    }

#Get an array of course instances
#Access the Assignments page in HAC, extract the name and grade of the class as well as a list of assignments of that class and build a Course object
def getCurrentClasses(username, password):
    courses = []

    classesDOM = getPage(username, password, CLASSES_URL)

    parser = createBS4Parser(classesDOM.text)
    classContainer = parser.find_all("div", "AssignmentClass")

    for container in classContainer:
        parser = createBS4Parser(f"<html><body>{container}</body></html>")
        headerContainer = parser.find_all("div", "sg-header sg-header-square")
        assignementsContainer = parser.find_all("div", "sg-content-grid")

        newCourse = Course("", "", "", "", [])

        for hc in headerContainer:
            parser = createBS4Parser(f"<html><body>{hc}</body></html>")
            newCourse.name = parser.find("a", "sg-header-heading").text.strip()
            newCourse.grade = parser.find("span", "sg-header-heading sg-right").text.strip().replace("Student Grades ", "").replace("%", "")

            if("advanced" in newCourse.name.lower() or "ap" in newCourse.name.lower()):
                newCourse.weight = "6"
            elif("ism" in newCourse.name.lower() or "academic dec" in newCourse.name.lower()):
                newCourse.weight = "5.5"
            else:
                newCourse.weight = "5"

            for name in doubleWeighted:
                if(name in newCourse.name.lower()):
                    newCourse.credits = "2"
                else:
                    newCourse.credits = "1"
            
        for ac in assignementsContainer:
            parser = createBS4Parser(f"<html><body>{ac}</body></html>")
            rows = parser.find_all("tr", "sg-asp-table-data-row")
            for assignmentContainer in rows:
                try:    
                    parser = createBS4Parser(f"<html><body>{assignmentContainer}</body></html>")
                    tds = parser.find_all("td")
                    assignmentName = parser.find("a").text.strip()
                    assignmentDateDue = tds[0].text.strip()
                    assignmentDateAssigned = tds[1].text.strip()
                    assignmentCategory = tds[3].text.strip()
                    assignmentScore = tds[4].text.strip()
                    assignmentTotalPoints = tds[5].text.strip()

                    newCourse.assignments.append(
                        {
                            "dateDue": assignmentDateDue,
                            "dateAssigned": assignmentDateAssigned,
                            "assignment": assignmentName,
                            "category": assignmentCategory,
                            "score": assignmentScore,
                            "totalPoints" : assignmentTotalPoints
                        }
                    )         
                except:
                    pass
        courses.append(newCourse)
       
    return courses

