import { useAuthContext } from "./useAuthContext"
import { usePlaylistsContext } from "./usePlaylistsContext"

export const useLogout = () => {
    const {dispatch: authDispatch} = useAuthContext()
    const {dispatch: playlistsDispatch} = usePlaylistsContext()

    const logout = () => {
        // remove user from storage
        localStorage.removeItem('user')

        // dispatch logout action
        authDispatch({type: "LOGOUT"})
        playlistsDispatch({type: "SET_PLAYLISTS", payload: null})
    }
    
    return {logout}
}