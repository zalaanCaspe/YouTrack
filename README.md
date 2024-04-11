# ![Image](./frontend/public/favicon.ico) YouTrack
YouTube Playlist Tracker, made for SWE6011 Assignment 2

This app allows users to track public and unlisted by identifying playlist videos that have been made private or deleted.


## Setting Up
YouTrack can only run on `localhost` for now. To try it for yourself, clone or download this repository. This is a MERN app, and thus, you will need to install `Node.js`, create a `MongoDB Atlas` account, and most importantly, get a   `YouTube Data API v3` credential key. 

You will also need to create a .env file in the backend folder with the following entries:
* `PORT` for the backend server (mine is 4000)
* `MONGO_URI` to contain the database connection
* `API_KEY` for the YouTube API key
* `RESPONSE_PART=snippet`
* `MAX_RESULTS` to limit the playlist lengths (mine is 5000) 


Open the app directory in a command line and run the following command to install dependencies.
```
npm install
```

Once all the dependencies are installed, run the following commands in 2 separate terminals
```
npm run dex
```
```
npm start
```

If successful, your default browser will open a new window with the app running.