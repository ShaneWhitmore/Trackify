const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlistController');

router.post('/createPlaylist' , playlistController.createPlaylist)

module.exports = router;