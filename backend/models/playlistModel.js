const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const playlistSchema = new Schema({
    playlistId: {
        type: String,
        required: true
    },
    playlistName: {
        type: String,
        required: true
    },
    videos: [{
        videoId: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        channelId: {
            type: String,
            required: true
        },
        channelTitle: {
            type: String,
            required: true
        },
        position: {
            type: Number,
            required: true
        },
        isAvailable: {
            type: Boolean,
            required: true
        }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Playlist', playlistSchema);