
# FISDHACAPI

REST API to scrape student information from Frisco ISD's Home Access Center (HAC) using puppeteer.js

Hosted with Express.js on a Raspberry Pi through Cloudflare Argo tunnel

----------

Base API URL: https://private-cornwall-affairs-landscape.trycloudflare.com


Frisco ISD Real-time GPA Site:

GitHub: https://github.com/SumitNalavade/FriscoISD_GPA_Site

Demo: https://fisd-gpa-calc.herokuapp.com/



Technologies Used:
-
- Puppeteer.js
- Node.js
- Express.js
- Raspberry Pi (Debian Linux)
- JavaScript


## API Reference

**Demo Username: "John"**

**Demo Password: "Doe"**

Note: Make sure to pass username and password as query strings for GET routes

Routes:
- GET student GPAs
- GET student information
- GET student class data
- GET student class data with assignment details
- POST get student predicted GPAs

<br>

#### Get a students HAC weighted & unweighted GPA

```http
  GET /students/gpa
```
Query Parameters:
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | **Required**. HAC username|
| `password` | `string` | **Required**. HAC password|

Example Request (Axios):
``` javascript
axios.get("https://private-cornwall-affairs-landscape.trycloudflare.com/students/gpa?username=john&password=doe").then((res) => {
    console.log(res.data); //Make sure to denote what data you want from the response
}).catch((error) => {
    console.log(error);
})
```
cURL:
``` cURL
curl -X GET \
  'https://private-cornwall-affairs-landscape.trycloudflare.com/students/gpa?username=john&password=doe' \
  -H 'Accept: */*' \
  -H 'User-Agent: Thunder Client (https://www.thunderclient.io)'
```

Response:
``` json
{
  "currentGPAS": {
    "weightedGPA" : 5.05,
    "unweightedGPA" : 3.88
  }
}
```

<br>

#### Get student information (Name, Grade, Counselor etc...)

```http
  GET /students/info
```
Query Parameters:
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `username`      | `string` | **Required**. HAC username|
| `password`      | `string` | **Required**. HAC password|

Example Request (Axios):
``` javascript
axios.get("https://private-cornwall-affairs-landscape.trycloudflare.com/students/info?username=john&password=doe").then((res) => {
    console.log(res.data);
}).catch((error) => {
    console.log(error);
})
```
cURL:
``` cURL
curl -X GET \
  'https://private-cornwall-affairs-landscape.trycloudflare.com/students/info?username=john&password=doe' \
  -H 'Accept: */*' \
  -H 'User-Agent: Thunder Client (https://www.thunderclient.io)'
```

Response:
``` json
{
  "studentData": {
    "studentID": "123456",
    "studentName": "John Doe",
    "studentBirthDate": "12/24/2003",
    "studentCounselor": "NELSON-MOON, LANNIS",
    "studentBuilding": "Heritage High School",
    "studentGrade": "12"
  }
}
```

<br>

#### Get student's current classes information (Name, Grade, Weight, Credits)

```http
  GET /students/currentclasses
```
Query Parameters:
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `username`      | `string` | **Required**. HAC username |
| `password`      | `string` | **Required**. HAC password |

Example Request (Axios):
``` javascript
axios.get("https://private-cornwall-affairs-landscape.trycloudflare.com/students/currentclasses?username=john&password=doe").then((res) => {
    console.log(res.data);
}).catch((error) => {
    console.log(error);
})
```

``` cURL
curl -X GET \
  'https://private-cornwall-affairs-landscape.trycloudflare.com/students/currentclasses?username=john&password=doe' \
  -H 'Accept: */*' \
  -H 'User-Agent: Thunder Client (https://www.thunderclient.io)'
```

Response:
``` json
{
  "currentClasses": [
    {
      "name": "CATE27600B - 3    Mobile App Programming S2@CTEC",
      "grade": 0,
      "weight": 6,
      "credits": 1
    },
    {
      "name": "CATE36400B - 1    Prac News Prod 2 S2",
      "grade": 0,
      "weight": 5,
      "credits": 1
    },
    {
      "name": "ELA14300B - 4    AP English Literature S2",
      "grade": 80,
      "weight": 6,
      "credits": 1
    },
    {
      "name": "MTH45300B - 1    AP Calculus AB S2",
      "grade": 80.8,
      "weight": 6,
      "credits": 1
    },
    {
      "name": "MTH45310B - 4    AP Statistics S2",
      "grade": 0,
      "weight": 6,
      "credits": 1
    },
    {
      "name": "SCI43300B - 1    AP Environmental Science S2",
      "grade": 0,
      "weight": 6,
      "credits": 1
    },
    {
      "name": "SST34300 - 4    AP Government",
      "grade": 0,
      "weight": 6,
      "credits": 1
    }
  ]
}
```

<br>

#### Get student's current classes with assignments

```http
  GET /students/currentclasses/details
```
Query Parameters:
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `username`      | `string` | **Required**. HAC username |
| `password`      | `string` | **Required**. HAC password |

Example Request (Axios):
``` javascript
axios.get("https://private-cornwall-affairs-landscape.trycloudflare.com/students/currentclasses/details?username=john&password=doe").then((res) => {
    console.log(res.data);
}).catch((error) => {
    console.log(error);
})
```
cURL:
``` cURL
curl -X GET \
  'https://private-cornwall-affairs-landscape.trycloudflare.com/students/currentclasses/details?username=john&password=doe' \
  -H 'Accept: */*' \
  -H 'User-Agent: Thunder Client (https://www.thunderclient.io)'
```

Response:
``` json
{
  "currentClassesDetails": [
    {
      "className": "CATE36400B - 1 Prac News Prod 2 S2",
      "classGrade": "",
      "assignments": [
        {
          "dateDue": "03/04/2022",
          "dateAssigned": "02/09/2022",
          "assignment": "PA Script #3",
          "category": "Minor Grades",
          "score": "",
          "totalPoints": "100.00"
        },
        {
          "dateDue": "03/02/2022",
          "dateAssigned": "01/04/2022",
          "assignment": "Social Media Posts",
          "category": "Minor Grades",
          "score": "",
          "totalPoints": "100.00"
        },
        {
          "dateDue": "03/02/2022",
          "dateAssigned": "01/10/2022",
          "assignment": "MP3 Package/Segment #2",
          "category": "Major Grades",
          "score": "",
          "totalPoints": "100.00"
        },
        {
          "dateDue": "02/08/2022",
          "dateAssigned": "01/24/2022",
          "assignment": "PA Script #2",
          "category": "Minor Grades",
          "score": "",
          "totalPoints": "100.00"
        },
        {
          "dateDue": "02/04/2022",
          "dateAssigned": "01/11/2022",
          "assignment": "MP3 Package/Segment #1",
          "category": "Major Grades",
          "score": "",
          "totalPoints": "100.00"
        },
        {
          "dateDue": "01/21/2022",
          "dateAssigned": "01/04/2022",
          "assignment": "PA Script #1",
          "category": "Minor Grades",
          "score": "97.00",
          "totalPoints": "100.00"
        },
        {
          "dateDue": "01/06/2022",
          "dateAssigned": "01/04/2022",
          "assignment": "MP3 Calendar Check",
          "category": "Non-graded",
          "score": "100.0",
          "totalPoints": "100.00"
        }
      ]
    },
    {
      "className": "ELA14300B - 4 AP English Literature S2",
      "classGrade": "80.00",
      "assignments": [
        {
          "dateDue": "01/05/2022",
          "dateAssigned": " ",
          "assignment": "Christmas Carol Q3 Essay",
          "category": "Minor Grades",
          "score": "80.00",
          "totalPoints": "100.00"
        }
      ]
    },
    {
      "className": "MTH45300B - 1 AP Calculus AB S2",
      "classGrade": "80.80",
      "assignments": [
        {
          "dateDue": "02/08/2022",
          "dateAssigned": " ",
          "assignment": "Unit 6 Test (Integration)",
          "category": "Major Grades",
          "score": "",
          "totalPoints": "100.00"
        },
        {
          "dateDue": "02/08/2022",
          "dateAssigned": " ",
          "assignment": "Delta Math Practice (Unit 6)",
          "category": "Minor Grades",
          "score": "",
          "totalPoints": "100.00"
        },
        {
          "dateDue": "01/31/2022",
          "dateAssigned": " ",
          "assignment": "Quiz 4 (Antiderivatives and Rules of Integration)",
          "category": "Minor Grades",
          "score": "",
          "totalPoints": "100.00"
        },
        {
          "dateDue": "01/27/2022",
          "dateAssigned": " ",
          "assignment": "Quiz 3 (FTC and Definite Integrals)",
          "category": "Minor Grades",
          "score": "",
          "totalPoints": "100.00"
        },
        {
          "dateDue": "01/25/2022",
          "dateAssigned": " ",
          "assignment": "Quiz 2 (Properties of Def. Integrals)",
          "category": "Minor Grades",
          "score": "",
          "totalPoints": "100.00"
        },
        {
          "dateDue": "01/19/2022",
          "dateAssigned": " ",
          "assignment": "Quiz 1 (Reimann Sums and Definite Integrals)",
          "category": "Minor Grades",
          "score": "",
          "totalPoints": "100.00"
        },
        {
          "dateDue": "01/10/2022",
          "dateAssigned": " ",
          "assignment": "Unit 5 Test (Analytical Applications of Derivatives)",
          "category": "Major Grades",
          "score": "78.00",
          "totalPoints": "100.00"
        },
        {
          "dateDue": "01/10/2022",
          "dateAssigned": " ",
          "assignment": "Delta Math Practice (Unit 5)",
          "category": "Minor Grades",
          "score": "85.00",
          "totalPoints": "100.00"
        }
      ]
    },
    {
      "className": "SST34300 - 4 AP Government",
      "classGrade": "",
      "assignments": [
        {
          "dateDue": "02/23/2022",
          "dateAssigned": " ",
          "assignment": "Midterm Exam (Units 1 & 2)",
          "category": "Major Grades",
          "score": "",
          "totalPoints": "100.00"
        },
        {
          "dateDue": "02/16/2022",
          "dateAssigned": " ",
          "assignment": "Unit 2 Major Grade FRQ",
          "category": "Major Grades",
          "score": "",
          "totalPoints": "100.00"
        },
        {
          "dateDue": "02/14/2022",
          "dateAssigned": " ",
          "assignment": "Unit 2 MC Quiz",
          "category": "Minor Grades",
          "score": "",
          "totalPoints": "100.00"
        },
        {
          "dateDue": "02/11/2022",
          "dateAssigned": " ",
          "assignment": "Unit 2 Argument FRQ Practice",
          "category": "Minor Grades",
          "score": "",
          "totalPoints": "100.00"
        },
        {
          "dateDue": "02/04/2022",
          "dateAssigned": " ",
          "assignment": "Unit 2 Congress FRQ Practice",
          "category": "Minor Grades",
          "score": "",
          "totalPoints": "100.00"
        },
        {
          "dateDue": "01/21/2022",
          "dateAssigned": " ",
          "assignment": "Unit 1 Major Grade FRQ",
          "category": "Major Grades",
          "score": "",
          "totalPoints": "100.00"
        },
        {
          "dateDue": "01/21/2022",
          "dateAssigned": " ",
          "assignment": "Unit 1 MC Quiz",
          "category": "Minor Grades",
          "score": "",
          "totalPoints": "100.00"
        },
        {
          "dateDue": "01/14/2022",
          "dateAssigned": " ",
          "assignment": "Unit 1 Concept Application & Argument FRQ Practice",
          "category": "Minor Grades",
          "score": "",
          "totalPoints": "100.00"
        }
      ]
    }
  ]
}
```

<br>

#### Get student's predicted GPAs

```http
  POST /predictedGPA
```
Body (JSON): *Route will accept only JSON data in the body
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `weightedGPA` | `number` | **Required**. Student's weighted GPA in HAC |
| `unweightedGPA`| `number` | **Required**. Student's unweighted GPA in HAC |
| `studentGrade`| `number` | **Required**. Student's current grade level |
| `currentClasses`| `array` | **Required**. Array of student class objects (You can use /students/currentClasses to get this)|

Example Request (Axios):

```javascript
  axios.post(`https://private-cornwall-affairs-landscape.trycloudflare.com/predictedGPA`, {
    weightedGPA: 5.05,
    unweightedGPA: 3.88,
    studentGrade: 12,
    currentClasses: [
        {
          "name": "CATE27600A - 3    Mobile App Programming S1@CTEC",
          "grade": 100,
          "weight": 6,
          "credits": 1
        },
        {
          "name": "CATE36400A - 1    Prac News Prod 2 S1",
          "grade": 91.48,
          "weight": 5,
          "credits": 1
        },
        {
          "name": "ELA14300A - 4    AP English Literature S1",
          "grade": 88.13,
          "weight": 6,
          "credits": 1
        },
        {
          "name": "MTH45300A - 1    AP Calculus AB S1",
          "grade": 79.4,
          "weight": 6,
          "credits": 1
        },
        {
          "name": "MTH45310A - 4    AP Statistics S1",
          "grade": 79.48,
          "weight": 6,
          "credits": 1
        },
        {
          "name": "SCI43300A - 1    AP Environmental Science S1",
          "grade": 94,
          "weight": 6,
          "credits": 1
        },
        {
          "name": "SST34310 - 3    AP Economics",
          "grade": 93.24,
          "weight": 6,
          "credits": 1
        }
      ]
}).then((result) => {
    console.log(result.data);
}).catch((error) => {
    console.log(error);
})
```

Example Request (cURL):
``` cURL
curl -X POST \
  'https://virtually-surplus-outcomes-entirely.trycloudflare.com/predictedGPA' \
  -H 'Accept: */*' \
  -H 'User-Agent: Thunder Client (https://www.thunderclient.io)' \
  -H 'Content-Type: application/json' \
  -d '{
    "weightedGPA" : 5.05,
    "unweightedGPA" : 3.88,
    "studentGrade" : 12,
    "currentClasses" : [
  {
    "name": "CATE27600A - 3    Mobile App Programming S1@CTEC",
    "grade": 100,
    "weight": 6,
    "credits": 1
  },
  {
    "name": "CATE36400A - 1    Prac News Prod 2 S1",
    "grade": 91.48,
    "weight": 5,
    "credits": 1
  },
  {
    "name": "ELA14300A - 4    AP English Literature S1",
    "grade": 88.13,
    "weight": 6,
    "credits": 1
  },
  {
    "name": "MTH45300A - 1    AP Calculus AB S1",
    "grade": 79.4,
    "weight": 6,
    "credits": 1
  },
  {
    "name": "MTH45310A - 4    AP Statistics S1",
    "grade": 79.48,
    "weight": 6,
    "credits": 1
  },
  {
    "name": "SCI43300A - 1    AP Environmental Science S1",
    "grade": 94,
    "weight": 6,
    "credits": 1
  },
  {
    "name": "SST34310 - 3    AP Economics",
    "grade": 93.24,
    "weight": 6,
    "credits": 1
  }
]
}'
```

Response
``` json
{
  "finalWeightedGPA": "5.018267857142857",
  "finalUnweightedGPA": "3.8539464285714287"
}
```
## FAQ

#### How does the API pull information from HAC

The puppeteer web scraping library is used with Node.js to log into a students HAC once they pass in a username and password. The scraper logs into the account and navigates the tabs and scrapes information.

#### How secure is the API

No user information is stored in any databases. All of the proccessing that happens in a request is dumped once the request has resolved.

#### Why does the base URI look weird

The API is hosted on an express.js server on a Raspberry Pi which is then exposed to the web through a Cloudflare Argo tunnel which provides a URI on it's own.

https://blog.cloudflare.com/a-free-argo-tunnel-for-your-next-project/
## Feedback

If you have any feedback, please reach out to me at vs.nalavade2003@gmail.com

## License

[MIT](https://choosealicense.com/licenses/mit/)

