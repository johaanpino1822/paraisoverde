// backend/routes/siteRoutes.js

const express = require('express');
const { createSite, getSites } = require('../controllers/siteController');
const router = express.Router();

router.post('/', createSite);
router.get('/', getSites);

module.exports = router;
