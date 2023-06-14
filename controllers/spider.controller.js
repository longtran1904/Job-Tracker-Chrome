const { crawl_google, crawl_google_cookies, crawl_google_backendContent } = require("../services/spider");


// DONE: read HTTP req to refer to google site 
// Get data on website through client-side
const get_google_content = async(req, res) => {
    console.log('came to get_google_content');
    console.log(req.query);
    const data = await crawl_google(req.query.url);
    console.log(data);
    if (data)
        res.status(200).send(data);
    else res.status(500).send('Something went wrong');
}

// Get data through server-side http request
const get_google_cookies = async(req, res) => {
    console.log('came to get_google_cookies');
    console.log(req.query);
    const data = await crawl_google_cookies(req.query.url);
    console.log(data);
    if (data)
        res.status(200).send(data);
    else res.status(500).send('Something went wrong');
}

const get_google_backend_content = async(req, res) => {
    console.log('came to get_google_backend_content');
    console.log(req.query);
    const cookies = await crawl_google_cookies(req.query.url);
    console.log(cookies);
    if (!cookies)
        res.status(500).send('Something went wrong');

    const content = await crawl_google_backendContent(req.query.url, cookies);
    if (content)
        res.status(200).send(content);
    else res.status(500).send('Something went wrong');
}

module.exports = {
    get_google_content,
    get_google_cookies,
    get_google_backend_content
}