import type { FileTypeResponse } from "~/api/types";
import { serverUrl } from "~/config";


export default function VideoSupport(file: FileTypeResponse) {
    const srcUrl = serverUrl(`/files/${file.path}`);

    return <div className="fixed inset-0 w-screen h-screen">
        <video className="object-contain w-full h-full my-auto" controls autoPlay disablePictureInPicture autoFocus preload="metadata">
            <source src={srcUrl} type={file.mime} />
        </video>
    </div>;
}
