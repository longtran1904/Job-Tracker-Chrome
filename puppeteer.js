const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const url = 'http://quotes.toscrape.com/';

const waitTillHTMLRendered = async(page, timeout = 30000) => {
    const checkDurationMsecs = 1000;
    const maxChecks = timeout / checkDurationMsecs;
    let lastHTMLSize = 0;
    let checkCounts = 1;
    let countStableSizeIterations = 0;
    const minStableSizeIterations = 3;

    while (checkCounts++ <= maxChecks) {
        let html = await page.content();
        let currentHTMLSize = html.length;

        let bodyHTMLSize = await page.evaluate(() => document.body.innerHTML.length);

        console.log('last: ', lastHTMLSize, ' <> curr: ', currentHTMLSize, " body html size: ", bodyHTMLSize);

        if (lastHTMLSize != 0 && currentHTMLSize == lastHTMLSize)
            countStableSizeIterations++;
        else
            countStableSizeIterations = 0; //reset the counter

        if (countStableSizeIterations >= minStableSizeIterations) {
            console.log("Page rendered fully..");
            break;
        }

        lastHTMLSize = currentHTMLSize;
        await page.waitForTimeout(checkDurationMsecs);
    }
};

app.get('/image', async(req, res) => {
    // puppeteer.launch() => Chrome running locally (on the same hardware)
    let browser = null;

    try {
        browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        await page.goto(url);
        const screenshot = await page.screenshot();

        res.end(screenshot, 'binary');
    } catch (error) {
        if (!res.headersSent) {
            res.status(400).send(error.message);
        }
    } finally {
        if (browser) {
            browser.close();
        }
    }
});

app.get('/quotes', async(req, res) => {
    let browser = null;
    try {
        browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto('http://quotes.toscrape.com/');

        const quotes = await page.evaluate((url) => {
            const quoteBlocks = Array.from(document.querySelectorAll('.quote'));
            const data = quoteBlocks.map((quote) => ({
                pageUrl: url,
                text: quote.querySelector('.text').innerText,
                author: quote.querySelector('.author').innerText,
            }))
            return data;
        }, url)

        res.send({ quotes });
    } catch (error) {
        if (!res.headersSent) {
            res.status(400).send(error.message);
        }
    } finally {
        if (browser) {
            browser.close();
        }
    }
})

app.get('/google-openings', async(req, res) => {
    let browser = null;
    try {
        browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto('https://careers.google.com/jobs/results/?distance=50&has_remote=false&hl=en_US&jlo=en_US&q=Software%20Engineer');

        await waitTillHTMLRendered(page);

        const openings = await page.evaluate((url) => {
            const jobBlocks = Array.from(document.querySelectorAll('ol#search-results > li'));
            const data = jobBlocks.map((job) => ({
                pageUrl: url,
                title: job.querySelector('h2').innerText
            }))
            return data;
        }, url)

        res.send({ openings });
    } catch (error) {
        if (!res.headersSent) {
            res.status(400).send(error.message);
        }
    } finally {
        if (browser) {
            browser.close();
        }
    }
})

app.listen(8080, () => console.log('Listening on PORT: 8080'));