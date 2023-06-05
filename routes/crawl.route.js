const express = require('express');
const router = express.Router();
const { get_google_content } = require('../controllers/spider.controller')

router.get('/', get_google_content);

module.exports = router;