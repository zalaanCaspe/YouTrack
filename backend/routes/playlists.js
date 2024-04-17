const express = require('express');
const {
    createPlaylist,
    getPlaylists,
    getPlaylist,
    deletePlaylist,
    deleteVideo,
    updatePlaylist
} = require('../controllers/playlistController');
const requireAuth = require('../middleware/requireAuth')

const router = express.Router();

// require auth for all app routes
router.use(requireAuth)

// GET all playlists
router.get('/', getPlaylists);

// GET a single playlist
router.get('/:playlistId', getPlaylist);

// POST a new playlist
router.post('/', createPlaylist);

// DELETE a playlist
router.delete('/:playlistId', deletePlaylist);

// UPDATE a playlist to remove a video
router.patch('/:playlistId/:videoId', deleteVideo);

// UPDATE a playlist
router.patch('/:playlistId', updatePlaylist);


module.exports = router;