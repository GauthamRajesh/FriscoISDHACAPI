const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;

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
    
    return res.send(gpas);
})

app.get("/students/info", async (req, res) => {
    const { username, password } = req.query;

    const info = await getInfo(username, password).catch((error) => {
        console.log(error);
    })
    
    return res.send(info);
})

app.get("/students/currentclasses", async (req, res) => {
    const { username, password } = req.query;

    const classes = await getClasses(username, password).catch((error) => {
        console.log(error);
    })

    res.send(classes);
})

app.get("/students/currentclasses/details", async (req, res) => {
    const { username, password } = req.query;

    const classes = await getClassesDetails(username, password).catch((error) => {
        console.log(error);
    })

    res.send(classes);
});

app.post("/students/predictedGPA", (req, res) => {
    const { weightedGPA, unweightedGPA, currentClasses, studentGrade } = req.body;

    const predictedGPAs = getPredictedGPA(weightedGPA, unweightedGPA, currentClasses, studentGrade)

    res.send(predictedGPAs);
})
