
# FISDHACAPI

REST API to scrape student information from Frisco ISD's Home Access Center (HAC) using puppeteer.js

Hosted with Express.js on a Raspberry Pi through Cloudflare Argo tunnel

Base API URL: https://virtually-surplus-outcomes-entirely.trycloudflare.com


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

#### Get a students HAC weighted & unweighted GPA

```http
  GET /students/gpa
```
Query Parameters:
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | **Required**. HAC username|
| `password` | `string` | **Required**. HAC password|


#### Get student information (Name, Grade, Counselor etc...)

```http
  GET /students/info
```
Query Parameters:
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `username`      | `string` | **Required**. HAC username|
| `password`      | `string` | **Required**. HAC password|


#### Get student's current classes information (Name, Grade, Weight, Credits)

```http
  GET /students/currentclasses
```
Query Parameters:
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `username`      | `string` | **Required**. HAC username |
| `password`      | `string` | **Required**. HAC password |

#### Get student's current classes with assignments

```http
  GET /students/currentclasses/details
```
Query Parameters:
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `username`      | `string` | **Required**. HAC username |
| `password`      | `string` | **Required**. HAC password |

#### Get student's predicted GPAs

```http
  POST /students/predictedGPA
```
Body (JSON):
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `weightedGPA` | `number` | **Required**. Student's weighted GPA in HAC |
| `unweightedGPA`| `number` | **Required**. Student's unweighted GPA in HAC |
| `studentGrade`| `number` | **Required**. Student's current grade level |
| `currentClasses`| `array` | **Required**. Array of student class objects (You can use /students/currentClasses to get this)|

Example Request (Axios):

```javascript
  axios.post(`https://abs-level-agency-remote.trycloudflare.com/students/predictedGPA`, {
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
  'https://abs-level-agency-remote.trycloudflare.com/students/predictedGPA' \
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

