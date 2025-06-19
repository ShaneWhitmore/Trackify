const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlistController');

router.post('/createPlaylist' , playlistController.createPlaylist)
router.put('/startPlayback', playlistController.startPlayback)
router.put('/pausePlayback', playlistController.pausePlayback)


module.exports = router;