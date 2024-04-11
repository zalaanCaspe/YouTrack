import { PlaylistsContext } from "../context/PlaylistsContext";
import { useContext } from "react";

export const usePlaylistsContext = () => {
    const context = useContext(PlaylistsContext)

    if (!context) {
        throw Error("usePlaylistsContext must be used inside a PlaylistsContextProvider")
    }
    
    return context
}