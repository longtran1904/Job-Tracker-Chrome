const express = require('express')
const app = express()
const crawlRoutes = require('./routes/crawl.route')
const mongoose = require('mongoose')

const port = 8080

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use('/crawl', crawlRoutes);



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})