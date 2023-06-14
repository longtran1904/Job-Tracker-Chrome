const express = require('express');
const router = express.Router();
const { get_google_content, get_google_cookies, get_google_backend_content } = require('../controllers/spider.controller');
const route = require('color-convert/route');

router.get('/', get_google_content);
router.get('/cookies', get_google_cookies);
router.get('/backendContent', get_google_backend_content);

module.exports = router;