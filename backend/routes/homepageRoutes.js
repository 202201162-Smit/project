const express = require('express');
const router = express.Router();
const homepageController = require('../Controller/homepage');

// Route to get trending events
router.get('/latestevent', homepageController.getLatest);
router.get('/trendingevent', homepageController.getTrending);

module.exports = router;
