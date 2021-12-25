const express = require("express");
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

const { getGPA } = require("./puppeteerFunctions");

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
    
    res.send(gpas);
})