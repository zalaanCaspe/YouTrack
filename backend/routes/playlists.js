const express = require('express');
const {
    createPlaylist,
    getPlaylists,
    getPlaylist,
    deletePlaylist,
    updatePlaylist
} = require('../controllers/playlistController');

const router = express.Router();

// GET all playlists
router.get('/', getPlaylists);

// GET a single playlist
router.get('/:playlistId', getPlaylist);

// POST a new playlist
router.post('/', createPlaylist);

// DELETE a playlist
router.delete('/:playlistId', deletePlaylist);

// UPDATE a playlist
router.patch('/:playlistId', updatePlaylist);


module.exports = router;