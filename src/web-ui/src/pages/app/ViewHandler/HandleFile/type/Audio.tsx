import { serverUrl } from "~/config";
import type { FileTypeResponse } from "~/api/types";


export default function AudioSupport(file: FileTypeResponse) {
    const srcUrl = serverUrl(`/files/${file.path}`);
    return <div className="grid h-screen p-1 place-content-center">
        <audio src={srcUrl} controls autoPlay className="w-[90vw] rounded-md h-fit" />
    </div>;
}
