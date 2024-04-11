import { usePlaylistsContext } from '../hooks/usePlaylistsContext'

// date fns
import format from 'date-fns/format'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const PlaylistDetails = ({ playlist }) => {
    const { dispatch } = usePlaylistsContext()

    const handleClick = async () => {
        const response = await fetch('/api/playlists/' + playlist._id, {
            method: "DELETE"
        })
        const json = await response.json()

        if (response.ok) {
            dispatch({type: 'DELETE_PLAYLIST', payload: json})
        }
    }

    return (
        <div className="playlist-details">
            <h4>{playlist.playlistName}</h4>
            <p><strong>Last Updated: </strong>{format(new Date(playlist.updatedAt), "MMM dd, yyyy 'at' hh:mmaaa")}</p>
            <p>{formatDistanceToNow(new Date(playlist.createdAt), {addSuffix: true})}</p>
            <span onClick={handleClick} className='material-symbols-outlined'>delete</span>
        </div>
    );
}
 
export default PlaylistDetails;