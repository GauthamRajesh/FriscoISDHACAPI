import requests
from bs4 import BeautifulSoup
from AppError import AppError

LOGIN_URL = "https://hac.friscoisd.org/HomeAccess/Account/LogOn?ReturnUrl=%2fHomeAccess%2f"
TRANSCRIPT_URL = "https://hac.friscoisd.org/HomeAccess/Content/Student/Transcript.aspx"
REGISTRATION_URL = "https://hac.friscoisd.org/HomeAccess/Content/Student/Registration.aspx"
CLASSES_URL = "https://hac.friscoisd.org/HomeAccess/Content/Student/Assignments.aspx"
SATSCHEDULE_URL = "https://satsuite.collegeboard.org/sat/registration/dates-deadlines"

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
    try:
        (requestVerificationToken, session_requests) = getRequestVerificationToken()
    except:
        return AppError(500, "HAC Server Error")

    requestHeaders = createRequestHeaders(requestVerificationToken)
    requestPayload = createRequestPayload(username, password, requestVerificationToken)

    #Get through the login screen
    pageDOM = session_requests.post(
        LOGIN_URL,
        data=requestPayload,
        headers=requestHeaders
    )

    #Throw a 500 error if the login fails
    if(pageDOM.url != "https://hac.friscoisd.org/HomeAccess/Classes/Schedule"):
        return AppError(400, "HAC login failed")

    #Reroute to the final page
    pageDOM = session_requests.get(pageURL)

    return pageDOM
