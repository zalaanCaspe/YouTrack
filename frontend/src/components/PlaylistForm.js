import { useState } from "react";
import { usePlaylistsContext } from "../hooks/usePlaylistsContext";

const PlaylistForm = () => {
    const {dispatch} = usePlaylistsContext()

    const [playlistId, setPlaylistId] = useState('');
    const [playlistName, setPlaylistName] = useState('');
    const [error, setError] = useState(null);
    const [errorFields, setErrorFields] = useState([])

    const handleSubmit = async (e) => {
        e.preventDefault();

        const playlist = {playlistId, playlistName};
        
        const response = await fetch('/api/playlists/', {
            method: 'POST',
            body: JSON.stringify(playlist),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const json = await response.json();

        if (!response.ok) {
            setError(json.error)
            setErrorFields(json.errorFields)
        }
        if(response.ok) {
            setError(null);
            setErrorFields([]);
            setPlaylistId('');
            setPlaylistName('');
            dispatch({type: 'CREATE_PLAYLIST', payload: json})
        }
    }
    
    return ( 
        <form className="create" onSubmit={handleSubmit}>
            <h3>Track a New Playlist</h3>

            <label>Playlist ID: </label>
            <input 
                type="text" 
                onChange={(e) => setPlaylistId(e.target.value)}
                value={playlistId}
                className={errorFields.includes('playlistId') ? 'error' : ''}
            />

            <label>Save As: </label>
            <input 
                type="text" 
                onChange={(e) => setPlaylistName(e.target.value)}
                value={playlistName}
                className={errorFields.includes('playlistName') ? 'error' : ''}
            />

            <button>Track Playlist</button>
            {error && <div className="error">{error}</div>}
        </form>
    );
}
 
export default PlaylistForm;