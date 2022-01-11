const express = require("express");
const cors = require("cors");
const fakeData = require("./fakeData");
const AppError = require("./AppError");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/students/*", (req, res, next) => {
    const { username, password } = req.query;

    if(username.toLowerCase() === "john" && password.toLowerCase() === "doe") {
        return res.send(fakeData);
    } else {
        return next();
    }
});

const { getGPA, getInfo, getClasses, getClassesDetails, getPredictedGPA } = require("./puppeteerFunctions");

app.listen(PORT, (req, res) => {
    console.log(`Express app listening on port ${PORT}`);
})

app.get("/", (req, res) => {
    res.send("Hello World");
});

//Function catches any errors from an async function that is passed in and calls the next(Error) handler
function wrapAsync(fn, errorMessage) {
    return function (req, res, next) {
        fn(req, res, next).catch((error) => {
            console.log(error);
            return next(new AppError(errorMessage), 500);
        })
    }
}

app.get("/students/gpa", wrapAsync(async (req, res, next) => {
    const { username, password } = req.query;
    
    const gpas = await getGPA(username, password);
     
    return res.send({
        currentGPAS: gpas
    });
}, "Cannot find gpas for student"))

app.get("/students/info", wrapAsync(async (req, res, next) => {
    const { username, password } = req.query;

    const info = await getInfo(username, password);
    
    return res.send({
        studentData: info
    });
}, "Cannot find info for student"))

app.get("/students/currentclasses", wrapAsync(async (req, res, next) => {
    const { username, password } = req.query;

    const classes = await getClasses(username, password);

    return res.send({
        currentClasses: classes
    });
}, "Cannot find classes for student"))

app.get("/students/currentclasses/details", wrapAsync(async (req, res, next) => {
    const { username, password } = req.query;

    const classes = await getClassesDetails(username, password);

    res.send({
        currentClassesDetails: classes
    });
}, "Cannot find classes for student"));

app.post("/predictedGPA", (req, res, next) => {
    const { weightedGPA, unweightedGPA, currentClasses, studentGrade } = req.body;
    
    const predictedGPAs = getPredictedGPA(weightedGPA, unweightedGPA, currentClasses, studentGrade)

    res.send(predictedGPAs);
});

app.use((err, req, res, next) => {
    const { status = 500, message = "Error" } = err;
    res.status(status).send(message);
});

