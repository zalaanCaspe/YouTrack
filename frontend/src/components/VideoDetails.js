import { Link } from 'react-router-dom'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useAuthContext } from '../hooks/useAuthContext';
import { useVideosContext } from '../hooks/useVideosContext'

const VideoDetails = (props) => {
    const {playlistId, video} = props
    const { user } = useAuthContext();
    const { dispatch } = useVideosContext()

    const handleClick = async (e) => {
        e.preventDefault();

        if (!user) {
            return
        }

        const response = await fetch(`/api/playlists/${playlistId}/${video._id}`, {
            method: "PATCH",
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (response.ok) {
            dispatch({type: 'DELETE_VIDEO', payload: json})
        }
    }
    
    return (
        <div className="video-container">
            <Link 
                className="video-item" 
                to={`https://youtu.be/${video.videoId}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                >
                <div className="video-position">{video.position + 1}</div>
                <div className="video-thumbnail">
                    <LazyLoadImage 
                        src={`https://i.ytimg.com/vi/${video.videoId}/default.jpg`} 
                        alt="Video Thumbnail" 
                        />
                </div>
                <div className="video-info">
                    <h3 className="video-title">{video.title}</h3>
                    <Link 
                        to={`https://youtube.com/channel/${video.channelId}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="video-uploader">{video.channelTitle}
                    </Link>
                </div>
                <button onClick={handleClick} className="material-symbols-outlined">delete</button>
            </Link>
        </div>
    );
}
 
export default VideoDetails;