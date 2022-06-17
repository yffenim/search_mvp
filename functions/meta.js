const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');
// const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: process.env.CHROME_EXECUTABLE_PATH || await chromium.executablePath,
      headless: true,
    });

  // getting query data to build URL
  // const query = JSON.parse(event.body);
  // const url = "https://disboard.org/servers/tag/" + query;
  const url = "https://disboard.org/servers/tag/buffy";

  // code to get around bots
  const preparePageForTests = async (page) => {
  // Pass the User-Agent Test.
    const userAgent = 'Mozilla/5.0 (X11; Linux x86_64)' + 'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36';
    await page.setUserAgent(userAgent);
  };

  // const main = async () => {
    // launch in headless using env var to dev mode in chrome
    const page = await browser.newPage();
    await preparePageForTests(page); // for getting around bots

    await page.goto(url);

    await page.waitForSelector('.server-name');

    const name = await page.evaluate(() => 
      document.documentElement.querySelector('.server-name').innerText
    );
    console.log(typeof name);
    console.log(name);
  await browser.close();

  // const reply = main();

    return {
      statusCode: 200,
      body: JSON.stringify({
        status: 'Ok', 
        page: {
          name
        }
      })
    };
  // };
};
