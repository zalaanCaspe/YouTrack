import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuthContext } from '../hooks/useAuthContext';
import { useVideosContext } from '../hooks/useVideosContext';
import VideoDetails from '../components/VideoDetails'

const PlaylistPage = () => {
    const { id } = useParams();
    const {user} = useAuthContext();
    const {videos, dispatch} = useVideosContext()

    const handleUpdate = async () => {
        if (!user) {
            return
        }
        const response = await fetch('/api/playlists/' + id, {
            method: "PATCH",
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (response.ok) {
            dispatch({type: 'SET_VIDEOS', payload: json.videos})
        }
    }

    const handleRedirect = async () => {
        if (!user) {
            return
        }
        const response = await fetch('/api/playlists/' + id, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (response.ok) {
            window.open(`https://www.youtube.com/playlist?list=${json.playlistId}`, '_blank');
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`/api/playlists/${id}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const json = await response.json();

            if (response.ok) {
                dispatch({type: "SET_VIDEOS", payload: json.videos})
            }
        }

        if (user) {
            fetchData();
        }
    }, [user, id, dispatch]);


    return (
        <div className="playlist-container">
            <div className="playlist-control">
                <button className="material-symbols-outlined update-button" onClick={handleUpdate}>update</button>
                <button className="material-symbols-outlined open-button" onClick={handleRedirect}>open_in_new</button>
            </div>
            {(!videos || videos.length===0) && (<p>This playlist is empty!</p>)}
            {videos && videos.map(video => (
                <VideoDetails video={video} playlistId={id} key={video._id} />
            ))}
        </div>
    );
}
 
export default PlaylistPage;