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

exports.getGPA = async function(username, password) {
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

exports.getInfo = async function(username, password) {
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