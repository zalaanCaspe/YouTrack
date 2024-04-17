import { usePlaylistsContext } from '../hooks/usePlaylistsContext'
import { useAuthContext } from '../hooks/useAuthContext'
import { Link } from 'react-router-dom'

// date fns
import format from 'date-fns/format'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const PlaylistDetails = ({ playlist }) => {
    const { dispatch } = usePlaylistsContext()
    const { user } = useAuthContext()

    const handleClick = async () => {
        if (!user) {
            return
        }

        const response = await fetch('/api/playlists/' + playlist._id, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (response.ok) {
            dispatch({type: 'DELETE_PLAYLIST', payload: json})
        }
    }

    return (
        <div className="playlist-details">
            <Link to={`/playlists/${playlist._id}`}>
                <h4>{playlist.playlistName}</h4>
                <p><strong>Last Updated: </strong>{format(new Date(playlist.updatedAt), "MMM dd, yyyy 'at' hh:mmaaa")}</p>
                <p>{formatDistanceToNow(new Date(playlist.createdAt), {addSuffix: true})}</p>
            </Link>
            <span onClick={handleClick} className='material-symbols-outlined'>delete</span>
        </div>
    );
}
 
export default PlaylistDetails;