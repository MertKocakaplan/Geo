const express = require('express');
const router = express.Router();
const havaDurumuController = require('../controllers/havaDurumuController');

router.get('/', havaDurumuController.getHavaDurumu);

module.exports = router;