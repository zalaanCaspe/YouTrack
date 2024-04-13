import { useEffect } from 'react';
import { usePlaylistsContext } from '../hooks/usePlaylistsContext';
import { useAuthContext } from '../hooks/useAuthContext'

// components
import PlaylistDetails from '../components/PlaylistDetails';
import PlaylistForm from '../components/PlaylistForm';

const Home = () => {
    const {playlists, dispatch} = usePlaylistsContext()
    const {user} = useAuthContext()

    useEffect(() => {
        const fetchPlaylists = async () => {
            const response = await fetch('/api/playlists', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const json = await response.json();

            if (response.ok) {
                dispatch({type: 'SET_PLAYLISTS', payload: json})
            }
        }

        if (user) {
            fetchPlaylists();
        }
    }, [dispatch, user])
    
    return (
        <div className="home">
            <div className="playlists">
                {(playlists===null || playlists.length===0) && (<p>Add your first playlist!</p>)}
                {playlists && playlists.map(playlist => (
                    <PlaylistDetails playlist={playlist} key={playlist._id} />
                ))}
            </div>
            <PlaylistForm />
        </div>
    );
}
 
export default Home;