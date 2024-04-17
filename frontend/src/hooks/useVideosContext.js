import { VideosContext } from "../context/VideosContext";
import { useContext } from "react";

export const useVideosContext = () => {
    const context = useContext(VideosContext)

    if (!context) {
        throw Error("useVideosContext must be used inside a VideosContextProvider")
    }
    
    return context
}