const puppeteer = require('puppeteer');
const { string } = require('yargs');

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

// const url = 'https://careers.google.com/jobs/results/?distance=50&has_remote=false&hl=en_US&jlo=en_US&q=Software%20Engineer';
const crawl_google = async(url) => {
    console.log('Came to spider service with url ' + url);
    let browser = null;
    try {
        browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        const all_openings = [];
        while (true) {
            await page.goto(url);

            await waitTillHTMLRendered(page);

            const openings = await page.evaluate((url) => {
                const jobBlocks = Array.from(document.querySelectorAll('ol#search-results > li'));
                const data = jobBlocks.map((job) => ({
                    pageUrl: url,
                    title: job.querySelector('h2').innerText
                }))

                return data ? data : null;
            }, url)

            const next = await page.evaluate(() => {
                const linkBlocks = Array.from(document.getElementsByTagName('a'));
                var nextLink = '';
                for (link of linkBlocks) {
                    if (link.innerText === "Next") {
                        nextLink = link.getAttribute('href');
                        break;
                    }
                }
                return nextLink;
            });


            console.log(openings);
            console.log(next);

            all_openings.push(openings);
            // console.log('got openings: \n' + openings);

            break;
        }

        return all_openings;
    } catch (error) {
        return error;
        // if (!res.headersSent) {
        //     res.status(400).send(error.message);
        // }
    } finally {
        if (browser) {
            browser.close();
        }
    }
}

const crawl_google_cookies = async (url) => {
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url);

    await waitTillHTMLRendered(page);

    const cookies = await page.cookies();

    return cookies;

}

const crawl_google_backendContent = async (url, cookies) => {
    // try {
    //     const myHeader = new Headers();
    //     myHeader.append("Cookie", cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join('; '));

    //     const myOptions = {
    //         method: "GET",
    //         headers: myHeader
    //     }

    //     const myRequest = new Request(url, myOptions);

    //     console.log(myRequest);

    //     const response = await fetch(url, {
    //         method: "GET",
    //         headers: myHeader
    //     })
    //     console.log(response);
    //     return response;
    // } catch (error) {
    //     console.log("Error: ", error);
    //     return error
    // }

    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url);

    await waitTillHTMLRendered(page);

    page.on('response', (response) => {
        console.log(response);
    })
}

module.exports = {
    crawl_google,
    crawl_google_cookies,
    crawl_google_backendContent
}