import requests
from lxml import html
from bs4 import BeautifulSoup

LOGIN_URL = "https://hac.friscoisd.org/HomeAccess/Account/LogOn?ReturnUrl=%2fHomeAccess%2f"

def main():
    session_requests = requests.session()
    result = session_requests.get(LOGIN_URL)
    tree = html.fromstring(result.text)
    veri_token = tree.xpath("/html/body/div/div/form/input/@value")[0]

    headerpayload = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.125 Safari/537.36',
    'X-Requested-With': 'XMLHttpRequest',
    'Host': 'hac.friscoisd.org',
    'Origin': 'hac.friscoisd.org',
    'Referer': "https://hac.friscoisd.org/HomeAccess/Account/LogOn?ReturnUrl=%2fhomeaccess%2f",
    '__RequestVerificationToken': veri_token
    }

    payload = {
        "__RequestVerificationToken" : veri_token,
        "SCKTY00328510CustomEnabled" : "False",
        "SCKTY00436568CustomEnabled" : "False",
        "Database" : "10",
        "VerificationOption" : "UsernamePassword",
        "LogOnDetails.UserName": "177611",
        "tempUN" : "",
        "tempPW" : "",
        "LogOnDetails.Password" : "12242003"
    };

    result = session_requests.post(
    LOGIN_URL,
    data=payload,
    headers=headerpayload
    )

    result = session_requests.get("https://hac.friscoisd.org/HomeAccess/Content/Student/Transcript.aspx")
    soup = BeautifulSoup(result.text, 'html.parser')
    print (soup.find(id='plnMain_rpTranscriptGroup_lblGPACum2').text)
    

# Entry point
if __name__ == '__main__':
    main()

#/html/body/div/div/form/input