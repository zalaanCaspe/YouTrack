const Playlist = require('../models/playlistModel');
const mongoose = require('mongoose');
const youtube = require('@googleapis/youtube');


// create google api client for youtube
const ytClient = youtube.youtube({
  version: 'v3',
  auth: process.env.API_KEY
});

const retreiveFromYt = async (playlistId) => {
  var videos = []
  
  try {
    var nextPageToken;
    do {
      // retrieve 50 videos
      let response = await ytClient.playlistItems.list({
        part: 'snippet', 
        maxResults: 5000, 
        pageToken: nextPageToken,
        playlistId
      })
      // add the necessary fields of the videos to an array
      response.data.items.forEach(video => {
        var isAvailable = video.snippet.thumbnails.hasOwnProperty('default')
        videos.push({
          "videoId": video.snippet.resourceId.videoId,
          "title": video.snippet.title,
          "channelId": isAvailable ? video.snippet.videoOwnerChannelId : 'Unavailable',
          "channelTitle": isAvailable ? video.snippet.videoOwnerChannelTitle : 'Unavailable',
          "position": video.snippet.position,
          "isAvailable": isAvailable,
          "isNewVideo": true
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
  const userId = req.user._id

  const playlists = await Playlist.find({ userId }).sort({updatedAt: -1});

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
    errorFields.push('playlistId')
    return res.status(400).json({error: "Please enter a valid playlist ID", errorFields});
  }

  // add doc to db
  try {
    const userId = req.user._id
    const playlist = await Playlist.create({playlistId, playlistName, videos, userId});
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

// delete a video from a playlist aka update the playlist videos
const deleteVideo = async (req, res) => {
  const { playlistId, videoId } = req.params

  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    return res.status(404).json({error: 'No such playlist'})
  }
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    return res.status(404).json({error: 'No such video'})
  }

  await Playlist.findOneAndUpdate({_id: playlistId}, {
    $pull: {
      videos:  {_id: videoId}
    }
  })

  res.status(200).json({videoId})
}

// update a Playlist
const updatePlaylist = async (req, res) => {
  const { playlistId } = req.params
  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    return res.status(404).json({error: 'No such playlist'})
  }

  const oldPlaylist = await Playlist.findById(playlistId)
  var oldVideos = oldPlaylist.videos

  const newVideos = await retreiveFromYt(oldPlaylist.playlistId)
  if (newVideos.hasOwnProperty("errors") && newVideos.error[0].reason == "playlistNotFound") {
    return res.status(400).json({error: "Playlist no longer available"})
  }

  // update position, availability and new status
  var removedVids = []
  oldVideos.forEach(oldVid => {
    var newVid = newVideos.find(v => v.videoId === oldVid.videoId)
    if (!newVid) {
      removedVids.push(oldVid)
    } else {
      oldVid.isNewVideo = false
      oldVid.position = newVid.position
      oldVid.isAvailable = newVid.isAvailable
      newVideos.splice(newVideos.indexOf(newVid), 1)
      delete oldVid._id
    }
  })
  oldVideos = oldVideos.filter(v => !removedVids.includes(v))

  // update database
  const updatedVideos = oldVideos.concat(newVideos).sort((a,b) => a.position - b.position)

  const playlist = await Playlist.findOneAndUpdate({_id: playlistId}, {
    videos: updatedVideos
  }, {new: true})

  if (!playlist) {
    return res.status(400).json({error: 'No such playlist'})
  }

  res.status(200).json(playlist)
}


module.exports = {
  getPlaylists,
  getPlaylist,
  createPlaylist,
  deletePlaylist,
  deleteVideo,
  updatePlaylist
}