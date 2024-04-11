import { useEffect } from 'react';
import { usePlaylistsContext } from '../hooks/usePlaylistsContext';

// components
import PlaylistDetails from '../components/PlaylistDetails';
import PlaylistForm from '../components/PlaylistForm';

const Home = () => {
    const {playlists, dispatch} = usePlaylistsContext()

    useEffect(() => {
        const fetchPlaylists = async () => {
            const response = await fetch('/api/playlists');
            const json = await response.json();

            if (response.ok) {
                dispatch({type: 'SET_PLAYLISTS', payload: json})
            }
        }

        fetchPlaylists();
    }, [dispatch])
    
    return (
        <div className="home">
            <div className="playlists">
                {playlists && playlists.map(playlist => (
                    <PlaylistDetails playlist={playlist} key={playlist._id} />
                ))}
            </div>
            <PlaylistForm />
        </div>
    );
}
 
export default Home;