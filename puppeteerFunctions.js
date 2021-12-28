const puppeteer = require('puppeteer');

async function startBrowser(username, password) {
    const browser = await puppeteer.launch({ 
        headless: true,
        defaultViewport: null,
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });

  const page = await browser.newPage();
  await page.goto('https://hac.friscoisd.org/HomeAccess/Grades/Transcript');

  await page.type('#LogOnDetails_UserName', username);
  await page.type('#LogOnDetails_Password', password)
  await page.$eval('#login', el => el.click())
  
  await page.waitForNavigation();

  return { page, browser } 
}

async function getGPA(username, password) {
    let weightedGPA;
    let unweightedGPA;

    const { page, browser } = await startBrowser(username, password);

    
    await page.goto("https://hac.friscoisd.org/HomeAccess/Content/Student/Transcript.aspx")
        let elm = await page.$("#plnMain_rpTranscriptGroup_lblGPACum1")
        weightedGPA = await (await elm.getProperty('textContent')).jsonValue()
        
        elm = await page.$("#plnMain_rpTranscriptGroup_lblGPACum2")
        unweightedGPA = await (await elm.getProperty('textContent')).jsonValue()
    
    
    await browser.close()

    return {
        weightedGPA: weightedGPA,
        unweightedGPA: unweightedGPA
    };
}
exports.getGPA = getGPA

async function getInfo(username, password) {
    let studentID, studentName, studentBirthDate, studentCounselor, studentBuilding, studentGrade;

   const { page, browser } = await startBrowser(username, password);

   await page.goto("https://hac.friscoisd.org/HomeAccess/Content/Student/Registration.aspx")
   let elm = await page.$("#plnMain_lblRegStudentID")
   studentID = await (await elm.getProperty('textContent')).jsonValue()
   
   elm = await page.$("#plnMain_lblRegStudentName")
   studentName = await (await elm.getProperty('textContent')).jsonValue()

   elm = await page.$("#plnMain_lblBirthDate")
   studentBirthDate = await (await elm.getProperty('textContent')).jsonValue()

   elm = await page.$("#plnMain_lblCounselor")
   studentCounselor = await (await elm.getProperty('textContent')).jsonValue()

   elm = await page.$("#plnMain_lblBuildingName")
   studentBuilding = await (await elm.getProperty('textContent')).jsonValue()

   elm = await page.$("#plnMain_lblGrade")
   studentGrade = await (await elm.getProperty('textContent')).jsonValue()

    await browser.close()

    return {
        studentID,
        studentName,
        studentBirthDate,
        studentCounselor,
        studentBuilding,
        studentGrade
    }
}
exports.getInfo = getInfo

async function getClasses(username, password) {
    const classes = [];

    const { page, browser } = await startBrowser(username, password);
    await page.goto("https://hac.friscoisd.org/HomeAccess/Content/Student/Assignments.aspx")
    
    const classNames = await page.evaluate(() => Array.from(document.querySelectorAll('a.sg-header-heading'), element => element.textContent.trim()));
    const classGrades = await page.evaluate(() => Array.from(document.querySelectorAll('.sg-header-heading.sg-right'), element => Number(element.textContent.trim().replace("Student Grades ", "").replace("%", ""))));
 
    classNames.forEach((elm) => {
        let name = elm
         let grade = classGrades[classNames.indexOf(elm)]
         
         classes.push({ name, grade })
    })
 
    return classes
}
exports.getClasses = getClasses

exports.getClassesDetails = async function(username, password) {
   var { page, browser } = await startBrowser(username, password);
   await page.goto("https://hac.friscoisd.org/HomeAccess/Content/Student/Assignments.aspx")

   const classes = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.AssignmentClass .sg-content-grid>.sg-asp-table tbody'), element => {
        const className = element.parentElement.parentElement.parentElement.children[0].children[1].innerText.trim();
        const classGrade = element.parentElement.parentElement.parentElement.children[0].children[3].innerText.trim().replace("Student Grades ", "").replace("%", "");

        const course = {
            className,
            classGrade,
            assignments: [

            ]
        }
       
        Array.from(element.children).forEach((tr) => {
                course.assignments.push( {
                    dateDue : tr.children[0].innerText,
                    dateAssigned: tr.children[1].innerText,
                    assignment: tr.children[2].innerText,
                    category: tr.children[3].innerText,
                    score: tr.children[4].innerText,
                    totalPoints: tr.children[5].innerText
                }
                )
            })

        course.assignments.shift()

        return course
     })
   })

   return classes
   
}

exports.getPredictedGPA = async function(username, password) {
    let studentGrade, currentGPA, currentClasses;

    await Promise.all([getInfo(username, password), getGPA(username, password), getClasses(username, password)]).then((res) => {
        studentGrade = res[0].studentGrade;
        currentGPA = res[1]
        currentClasses = res[2];
    })
}