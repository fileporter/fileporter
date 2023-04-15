import type { FileTypeResponse } from "~/types";
import AudioSupport from "./Audio";
import ImageSupport from "./Image";
import TextSupport from "./Text";
import VideoSupport from "./Video";
import ApiFileDownloadLink from "~/elements/OpenModeLink/ApiFileDownloadLink";
// import OpenInNewTab from "./OpenInNewTab";


export const MediaSupportIndex: Record<string, undefined | ((p: FileTypeResponse) => JSX.Element)> = {
    audio: AudioSupport,
    image: ImageSupport,
    text: TextSupport,
    video: VideoSupport,
};


export default function HandleFile(file: FileTypeResponse) {
    const mimeStart = file.mime?.split("/")[0] ?? "unknown";
    const MediaView = MediaSupportIndex[mimeStart];
    if (MediaView) {
        return <MediaView {...file} />;
    }
    // return <OpenInNewTab {...file} />;
    return <UnsupportedMessage {...file} />;
}

function UnsupportedMessage(file: FileTypeResponse) {
    return <div className="grid h-screen gap-1 text-center place-content-center">
        <p className="text-xl">Files of type &apos;{file.extension}&apos; are not supported</p>
        <p>You may <ApiFileDownloadLink className="text-blue-500 hover:underline" to={file.path}>download the file</ApiFileDownloadLink> if this helps</p>
    </div>;
}
