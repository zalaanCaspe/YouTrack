import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { PlaylistsContextProvider } from './context/PlaylistsContext';
import {AuthContextProvider} from './context/AuthContext'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <PlaylistsContextProvider>
        <App />
      </PlaylistsContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
