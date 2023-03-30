import { FileTypeResponse } from "~/types";
import ImageSupport from "./Image";
import VideoSupport from "./Video";
import AudioSupport from "./Audio";


export const MediaSupportIndex: Record<string, ((p: FileTypeResponse) => JSX.Element)> = {
    image: ImageSupport,
    video: VideoSupport,
    audio: AudioSupport,
}
