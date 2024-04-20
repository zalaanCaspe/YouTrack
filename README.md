# ![Image](./frontend/public/favicon.ico) YouTrack
YouTube Playlist Tracker, made for SWE6011 Assignment 2

This app allows users to track public and unlisted by identifying playlist videos that have been made private or deleted.


## Setting Up
YouTrack can only run on `localhost` for now. To try it for yourself, clone or download this repository. This is a MERN app, and thus, you will need to install `Node.js`, create a `MongoDB Atlas` account, and most importantly, get a   `YouTube Data API v3` credential key. 

### Backend
Create a .env file in the backend folder with the following:
* `PORT` for the backend server
* `MONGO_URI` to contain the database connection
* `API_KEY` for the YouTube API key
* `SECRET` as the JWT secret key (can be any random gibberish)

<br>

Run these commands in a terminal in the backend folder
```js
// install dependencies
npm install

// start server
npm run dev
```

### Frontend
Run these commands in a separate terminal in the frontend folder
```js
// install dependencies
npm install

// compile app frontend
npm start
```

<br><br>

If successful, your default browser will open a new window with the app running.