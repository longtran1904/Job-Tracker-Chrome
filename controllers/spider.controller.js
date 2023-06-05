const { crawl_google } = require("../services/spider");


// TODO: read HTTP req to refer to google site
const get_google_content = async(req, res) => {
    console.log('came to get_google_content');
    console.log(req.query);
    const data = await crawl_google(req.query.url);
    console.log(data);
    if (data)
        res.status(200).send(data);
    else res.status(500).send('Somethign went wrong');
}

module.exports = {
    get_google_content
}