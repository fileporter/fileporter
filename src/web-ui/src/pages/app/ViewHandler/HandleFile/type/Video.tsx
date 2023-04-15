import type { FileTypeResponse } from "~/types";
import { serverUrl } from "~/config";


export default function VideoSupport(file: FileTypeResponse) {
    const srcUrl = serverUrl(`/files/${file.path}`);

    return <div className="fixed inset-0 w-screen h-screen">
        <video className="object-contain w-full h-full my-auto" controls disablePictureInPicture preload="metadata">
            <source src={srcUrl} type={file.mime} />
        </video>
    </div>;
}
