import { useState } from "react";
import { useLocation } from "react-router-dom";
import { apiUrl } from "../../common";
import { FileTypeResponse } from "../../types";
import ApiFileLink from "../ApiFileLink";

export default function VideoSupport(file: FileTypeResponse) {
    const [videoFailed, setFailed] = useState(false);
    const location = useLocation();
    const filepath = location.pathname;
    const srcUrl = apiUrl(`/files/${filepath}`);

    return <div className="fixed inset-0 w-screen h-screen">
        {videoFailed ? 
        <div className="absolute text-center -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
            <h1 className="text-xl select-none">Video Failed to load</h1>
            <ApiFileLink className="text-blue-400 underline" to={filepath}>Open Directly</ApiFileLink>
        </div>
        :
        <video className="object-contain w-full h-full my-auto" controls autoPlay disablePictureInPicture preload="metadata" onError={() => setFailed(true)}>
            <source src={srcUrl} type={file.mime} />
        </video>
        }
    </div>
}
