const chromium = require("chrome-aws-lambda");
const puppeteer = require("puppeteer");

async function scraper(url) {
    const browser = await puppeteer.launch({
        args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: true,
        ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();
    await page.goto(url);
    const body = await page.content();

    return body;
}

module.exports = { scraper };
