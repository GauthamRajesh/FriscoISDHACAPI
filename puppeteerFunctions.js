const doubleWeighted = ['gt', 'physics c', 'veterinary', 'equipment', 'architectural design 2', 'interior design 2', 'animation', 'sports broadcasting', 'graphic Design', 'child guidance',
'education and training', 'practicum in govern', 'clinical', 'electrocardiography', 'medical technician', 'hospitality', 'culinary', 'ap computer', 'sports management']

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

  const url = page.url();
  if(url === "https://hac.friscoisd.org/HomeAccess/Grades/Transcript") {
    return { page, browser } 
  }

  await browser.close();
  throw 'Login Error';
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
        let weight;
        let credits;
        let name = elm

        if(name.toLowerCase().includes("advanced") || name.toLowerCase().includes("ap")) {
            weight = 6; 
        } else if(name.toLowerCase().includes("ism") || (name.toLowerCase().includes("academic dec"))) {
            weight = 5.5
        } else {
            weight = 5
        }

        doubleWeighted.forEach((elm) => {
            if(name.toLowerCase().includes(elm)) {
                credits = 2
            } else {
                credits = 1
            }
        })

         let grade = classGrades[classNames.indexOf(elm)]
         
         classes.push({ name, grade, weight, credits })
    })
 
    await browser.close()

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
   
   await browser.close()

   return classes
   
}

exports.getPredictedGPA = function(currentWeightedGPA, currentUnweightedGPA, currentClasses, studentGrade) {
    const pastSemesters = ((studentGrade - 8) * 2) - 1;
    let finalWeightedGPA, finalUnweightedGPA;

    const weightedGPAList = [];
    const unweightedGPAList = [];
    let totalCredits = currentClasses.reduce(function(total, course) {
        return total + course.credits
    }, 0)
   
    currentClasses.forEach((course) => {
        let weightedGPA, unweightedGPA;

        if(course.grade < 70) {
            weightedGPA = 0
            unweightedGPA = 0
        } else if(course.grade === 70) {
            weightedGPA = 3
            unweightedGPA = 2
        } else {
            weightedGPA = (
                (course.weight - ((100 - course.grade)/10)) * course.credits)

            unweightedGPA = ((4.0 - ((90 - course.grade)/10))
                             * course.credits)
            if(course.credits === 2  && unweightedGPA > 8) {
                unweightedGPA = 8.0
            } else if (unweightedGPA > 4) {
                unweightedGPA = 4
            }
        }

        weightedGPAList.push(weightedGPA)
        unweightedGPAList.push(unweightedGPA)
    })

    finalWeightedGPA = weightedGPAList.reduce((total, num) => total + num, 0) / totalCredits
    finalUnweightedGPA = unweightedGPAList.reduce((total, num) => total + num, 0) / totalCredits

    finalWeightedGPA = (((currentWeightedGPA) * pastSemesters) + finalWeightedGPA) / (pastSemesters+1)
    finalUnweightedGPA = (((currentUnweightedGPA) * pastSemesters) + finalUnweightedGPA) / (pastSemesters+1)  

    return { finalWeightedGPA, finalUnweightedGPA }
}