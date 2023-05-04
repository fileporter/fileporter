import type { FileTypeResponse } from "~/api/types";
import { serverUrl } from "~/config";
import VideoPlayer from "~/elements/Video";


export default function VideoSupport(file: FileTypeResponse) {
    const srcUrl = serverUrl(`/files/${file.path}`);

    return <div className="fixed inset-0 w-screen h-screen">
        <VideoPlayer className="object-contain w-full h-full my-auto">
            <source src={srcUrl} type={file.mime} />
        </VideoPlayer>
    </div>;
}
