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

    await page.goto("https://hac.friscoisd.org/HomeAccess/Content/Student/Transcript.aspx").catch((error) => console.log(error));
        let elm = await page.$("#plnMain_rpTranscriptGroup_lblGPACum1").catch((error) => console.log(error));
        weightedGPA = await (await elm.getProperty('textContent').catch((error) => console.log(error))).jsonValue().catch((error) => console.log(error));
        
        elm = await page.$("#plnMain_rpTranscriptGroup_lblGPACum2").catch((error) => console.log(error));
        unweightedGPA = await (await elm.getProperty('textContent').catch((error) => console.log(error))).jsonValue().catch((error) => console.log(error));

    await browser.close().catch((error) => console.log(error));

    return {
        weightedGPA: weightedGPA,
        unweightedGPA: unweightedGPA
    };
}