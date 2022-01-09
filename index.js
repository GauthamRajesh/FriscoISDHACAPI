const express = require("express");
const cors = require("cors");
const fakeData = require("./fakeData");

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
})

app.get("/students/gpa", async (req, res) => {
    const { username, password } = req.query;
    
    const gpas = await getGPA(username, password).catch((error) => {
        console.log(error);
    })
    
    return res.send({
        currentGPAS: gpas
    });
})

app.get("/students/info", async (req, res) => {
    const { username, password } = req.query;

    const info = await getInfo(username, password).catch((error) => {
        console.log(error);
    })
    
    return res.send({
        studentData: info
    });
})

app.get("/students/currentclasses", async (req, res) => {
    const { username, password } = req.query;

    const classes = await getClasses(username, password).catch((error) => {
        console.log(error);
    })

    return res.send({
        currentClasses: classes
    });
})

app.get("/students/currentclasses/details", async (req, res) => {
    const { username, password } = req.query;

    const classes = await getClassesDetails(username, password).catch((error) => {
        console.log(error);
    })

    res.send({
        currentClassesDetails: classes
    });
});

app.post("/predictedGPA", (req, res) => {
    const { weightedGPA, unweightedGPA, currentClasses, studentGrade } = req.body;

    const predictedGPAs = getPredictedGPA(weightedGPA, unweightedGPA, currentClasses, studentGrade)

    res.send(predictedGPAs);
})
