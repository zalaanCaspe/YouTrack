import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { PlaylistsContextProvider } from './context/PlaylistsContext';
import {AuthContextProvider} from './context/AuthContext'
import { VideosContextProvider } from './context/VideosContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <PlaylistsContextProvider>
        <VideosContextProvider>
          <App />
        </VideosContextProvider>
      </PlaylistsContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
