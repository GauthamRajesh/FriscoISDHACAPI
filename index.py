import requests
from bs4 import BeautifulSoup

LOGIN_URL = "https://hac.friscoisd.org/HomeAccess/Account/LogOn?ReturnUrl=%2fHomeAccess%2f"
TRANSCRIPT_URL = "https://hac.friscoisd.org/HomeAccess/Content/Student/Transcript.aspx"
REGISTRATION_URL = "https://hac.friscoisd.org/HomeAccess/Content/Student/Registration.aspx"
CLASSES_URL = "https://hac.friscoisd.org/HomeAccess/Content/Student/Assignments.aspx"

doubleWeighted = ['gt', 'physics c', 'veterinary', 'equipment', 'architectural design 2', 'interior design 2', 'animation', 'sports broadcasting', 'graphic Design', 'child guidance',
'education and training', 'practicum in govern', 'clinical', 'electrocardiography', 'medical technician', 'hospitality', 'culinary', 'ap computer', 'sports management']

# Create a BS4 object to parse the HTML string
def createBS4Parser(content):
    return BeautifulSoup(content, "html.parser")

#Extract the requestVerificationToken needed in the headers
#Return a tuple containing the token and the request session
#Note: The requestVerificationToken is linked to the request session so any function using the token must also use the request session
def getRequestVerificationToken():
    session_requests = requests.session()
    result = session_requests.get(LOGIN_URL)
    parser = createBS4Parser(result.text)
    return [parser.find('input', attrs={'name': '__RequestVerificationToken'})["value"], session_requests]

def createRequestHeaders(requestVerificationToken):
    return {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.125 Safari/537.36',
    'X-Requested-With': 'XMLHttpRequest',
    'Host': 'hac.friscoisd.org',
    'Origin': 'hac.friscoisd.org',
    'Referer': "https://hac.friscoisd.org/HomeAccess/Account/LogOn?ReturnUrl=%2fhomeaccess%2f",
    '__RequestVerificationToken': requestVerificationToken
    }

def createRequestPayload(username, password, requestVerificationToken):
    return {
        "__RequestVerificationToken" : requestVerificationToken,
        "SCKTY00328510CustomEnabled" : "False",
        "SCKTY00436568CustomEnabled" : "False",
        "Database" : "10",
        "VerificationOption" : "UsernamePassword",
        "LogOnDetails.UserName": username,
        "tempUN" : "",
        "tempPW" : "",
        "LogOnDetails.Password" : password
    }

#Return the page of the final location
def getPage(username, password, pageURL):
    (requestVerificationToken, session_requests) = getRequestVerificationToken()

    requestHeaders = createRequestHeaders(requestVerificationToken)
    requestPayload = createRequestPayload(username, password, requestVerificationToken)

    #Get through the login screen
    pageDOM = session_requests.post(
        LOGIN_URL,
        data=requestPayload,
        headers=requestHeaders
    )

    #Reroute to the final page
    pageDOM = session_requests.get(pageURL)

    return pageDOM


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

def getCurrentClasses(username, password):
    courses = []
   
    classesDOM = getPage(username, password, CLASSES_URL)

    parser = createBS4Parser(classesDOM.text)
    classContainer = parser.find_all("div", "AssignmentClass")

    for container in classContainer:
        parser = createBS4Parser(f"<html><body>{container}</body></html>")
        headerContainer = parser.find_all("div", "sg-header sg-header-square")
        assignementsContainer = parser.find_all("div", "sg-content-grid")

        className = ""
        classGrade = ""
        classWeight = ""
        classCredits = ""
        assignments = []

        for hc in headerContainer:
            parser = createBS4Parser(f"<html><body>{hc}</body></html>")
            className = parser.find("a", "sg-header-heading").text.strip()
            classGrade = parser.find("span", "sg-header-heading sg-right").text.strip().replace("Student Grades ", "").replace("%", "")

            if("advanced" in className.lower() or "ap" in className.lower()):
                classWeight = "6"
            elif("ism" in className.lower() or "academic dec" in className.lower()):
                classWeight = "5.5"
            else:
                classWeight = "5"

            for name in doubleWeighted:
                if(name in className.lower()):
                    classCredits = "2"
                else:
                    classCredits = "1"
            
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

                    assignments.append(
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
        courses.append(
            {
               "name" : className,
               "grade" : classGrade,
               "weight" : classWeight,
               "credits" : classCredits,
               "assignments": assignments 
            }
        )

    return courses

