import { createContext, useReducer } from "react";

export const VideosContext = createContext();

export const videosReducer = (state, action) => {
    switch (action.type) {
        case 'SET_VIDEOS':
            return {
                videos: action.payload
            }
        case 'DELETE_VIDEO':
            return {
                videos: state.videos.filter(v => v._id !== action.payload.videoId)
            }
        default:
            return state
    }
}

export const VideosContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(videosReducer, {
        videos: null
    })
    
    return (
        <VideosContext.Provider value={{...state, dispatch}}>
            {children}
        </VideosContext.Provider>
    )
}