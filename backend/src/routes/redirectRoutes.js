const express = require('express');
const router = express.Router();
const { redirectURL } = require('../controllers/urlController');

// Public redirect endpoint - must be at the end to avoid conflicting with API routes
router.get('/:shortCode', redirectURL);

module.exports = router;
