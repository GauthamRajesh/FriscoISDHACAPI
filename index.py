from email import parser
from urllib import request
from wsgiref import headers
import requests
from bs4 import BeautifulSoup

LOGIN_URL = "https://hac.friscoisd.org/HomeAccess/Account/LogOn?ReturnUrl=%2fHomeAccess%2f"
TRANSCRIPT_URL = "https://hac.friscoisd.org/HomeAccess/Content/Student/Transcript.aspx"

def createBS4Parser(content):
    return BeautifulSoup(content, "html.parser")

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
    
def getGPAS(username, password):
    (requestVerificationToken, session_requests) = getRequestVerificationToken()

    requestHeaders = createRequestHeaders(requestVerificationToken)
    requestPayload = createRequestPayload(username, password, requestVerificationToken)

    transcriptDOM = session_requests.post(
        LOGIN_URL,
        data=requestPayload,
        headers=requestHeaders
    )

    transcriptDOM = session_requests.get(TRANSCRIPT_URL)
    
    parser = createBS4Parser(transcriptDOM.text)
    weightedGPA = parser.find(id="plnMain_rpTranscriptGroup_lblGPACum1").text
    unWeightedGPA = parser.find(id="plnMain_rpTranscriptGroup_lblGPACum2").text

    return {
        "weightedGPA": weightedGPA,
        "unweightedGPA": unWeightedGPA
    }
