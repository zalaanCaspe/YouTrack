import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuthContext } from '../hooks/useAuthContext';
import { useVideosContext } from '../hooks/useVideosContext';
import VideoDetails from '../components/VideoDetails'

const PlaylistPage = () => {
    const { id } = useParams();
    const {user} = useAuthContext();
    const {videos, dispatch} = useVideosContext()

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
                <button className="material-symbols-outlined update-button">update</button>
                <button className="material-symbols-outlined delete-button">delete_forever</button>
            </div>
            {(!videos || videos.length===0) && (<p>This playlist is empty!</p>)}
            {videos && videos.map(video => (
                <VideoDetails video={video} playlistId={id} key={video._id} />
            ))}
        </div>
    );
}
 
export default PlaylistPage;