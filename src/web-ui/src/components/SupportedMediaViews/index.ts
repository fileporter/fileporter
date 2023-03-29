import { FileTypeResponse } from "~/types";
import ImageSupport from "./Image";
import VideoSupport from "./Video";


export const MediaSupportIndex: Record<string, undefined | ((p: FileTypeResponse) => JSX.Element)> = {
    image: ImageSupport,
    video: VideoSupport,
}
