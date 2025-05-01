const express = require('express');
const { createHotel, getHotels } = require('../controllers/hotelController');
const router = express.Router();

router.post('/', createHotel);
router.get('/', getHotels);

module.exports = router;
