const Playlist = require('../models/playlistModel');
const mongoose = require('mongoose');
const youtube = require('@googleapis/youtube');


// create google api client for youtube
const ytClient = youtube.youtube({
  version: 'v3',
  auth: process.env.API_KEY
});

const retreiveFromYt = async (playlistId, res) => {
  var videos = []
  
  try {
    var nextPageToken;
    do {
      // retrieve 50 videos
      let response = await ytClient.playlistItems.list({
        part: process.env.RESPONSE_PART, 
        maxResults: process.env.MAX_RESULTS, 
        pageToken: nextPageToken,
        playlistId
      })
      // add the necessary fields of the videos to an array
      response.data.items.forEach(video => {
        videos.push({
          "videoId": video.snippet.resourceId.videoId,
          "title": video.snippet.title,
          "channelId": video.snippet.channelId,
          "channelTitle": video.snippet.channelTitle,
          "position": video.snippet.position,
          "isAvailable": true
        })
      })
      
      var nextPageToken = response.data.nextPageToken;
    } while (nextPageToken)

    return videos;
  } catch (error) {
    return error
  }
}

// get all Playlists
const getPlaylists = async (req, res) => {
  const playlists = await Playlist.find({}).sort({createdAt: -1});

  res.status(200).json(playlists);
}

// get a single Playlist
const getPlaylist = async (req, res) => {
  const { playlistId } = req.params

  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    return res.status(404).json({error: 'No such playlist'})
  }

  const playlist = await Playlist.findById(playlistId)

  if (!playlist) {
    return res.status(404).json({error: 'No such playlist'})
  }
  
  res.status(200).json(playlist)
}

// create new Playlist
const createPlaylist = async (req, res) => {
  const { playlistId, playlistName } = req.body
  let errorFields = []
  
  if(!playlistId) {
    errorFields.push('playlistId')
  }
  if(!playlistName) {
    errorFields.push('playlistName')
  }
  if(errorFields.length > 0) {
    return res.status(400).json({ error: 'Please fill in all the fields', errorFields })
  }

  const videos = await retreiveFromYt(playlistId);
  if (videos.hasOwnProperty("errors") && videos.errors[0].reason == "playlistNotFound") {
    console.log("Invalid Playlist??")
    errorFields.push('playlistId')
    return res.status(400).json({error: "Please enter a valid playlist ID", errorFields});
  }

  try {
    // add doc to db
    const playlist = await Playlist.create({playlistId, playlistName, videos});
    res.status(200).json(playlist)
  } catch (error) {
    res.status(400).json({error: error.message})
  }          
}

// delete a Playlist
const deletePlaylist = async (req, res) => {
  const { playlistId } = req.params

  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    return res.status(404).json({error: 'No such playlist'})
  }

  const playlist = await Playlist.findOneAndDelete({_id: playlistId})

  if (!playlist) {
    return res.status(400).json({error: 'No such playlist'})
  }

  res.status(200).json(playlist)
}

// update a Playlist
const updatePlaylist = async (req, res) => {
  const { playlistId } = req.params

  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    return res.status(404).json({error: 'No such playlist'})
  }

  const playlist = await Playlist.findOneAndUpdate({_id: playlistId}, {
    ...req.body
  })

  if (!playlist) {
    return res.status(400).json({error: 'No such playlist'})
  }

  res.status(200).json({mssg: "updated playlist"})
}

// DELETE a single video from a playlist


module.exports = {
  getPlaylists,
  getPlaylist,
  createPlaylist,
  deletePlaylist,
  updatePlaylist
}