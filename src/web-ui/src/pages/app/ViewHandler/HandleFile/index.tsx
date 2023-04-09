import { FileTypeResponse } from "~/types";
import AudioSupport from "./Audio";
import ImageSupport from "./Image";
import TextSupport from "./Text";
import VideoSupport from "./Video";
import OpenInNewTab from "./OpenInNewTab";


export const MediaSupportIndex: Record<string, ((p: FileTypeResponse) => JSX.Element)> = {
    audio: AudioSupport,
    image: ImageSupport,
    text: TextSupport,
    video: VideoSupport,
}


export default function HandleFile(file: FileTypeResponse) {
    const mimeStart = file.mime?.split("/")[0] ?? "unknown";
    const MediaView = MediaSupportIndex[mimeStart];
    if (MediaView) {
        return <MediaView {...file} />;
    }
    return <OpenInNewTab {...file} />;
}
