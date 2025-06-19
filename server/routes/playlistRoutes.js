const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlistController');

router.post('/createPlaylist' , playlistController.createPlaylist)
router.post('/startPlayback', playlistController.startPlayback)
router.post('/pausePlayback', playlistController.pausePlayback)


module.exports = router;