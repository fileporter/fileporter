import type { FileTypeResponse } from "~/types";
import AudioSupport from "./type/Audio";
import ImageSupport from "./type/Image";
import TextSupport from "./type/Text";
import VideoSupport from "./type/Video";
import ApiFileDownloadLink from "~/elements/OpenModeLink/ApiFileDownloadLink";
// import OpenInNewTab from "./OpenInNewTab";


type Index = Record<string, undefined | ((p: FileTypeResponse) => JSX.Element)>

export const MimeSubtypeSupportIndex: Index = {

};
export const MimeTypeSupportIndex: Index = {
    audio: AudioSupport,
    image: ImageSupport,
    text: TextSupport,
    video: VideoSupport,
};


export default function HandleFile(file: FileTypeResponse) {
    if (!file.mime) {
        return <UnsupportedMessage {...file} />;
    }
    const SubtypeView = MimeSubtypeSupportIndex[file.mime];
    if (SubtypeView) {
        return <SubtypeView {...file} />;
    }
    const mimeStart = file.mime.split("/", 1)[0];
    const TypeView = MimeTypeSupportIndex[mimeStart];
    if (TypeView) {
        return <TypeView {...file} />;
    }
    // return <OpenInNewTab {...file} />;
    return <UnsupportedMessage {...file} />;
}

function UnsupportedMessage(file: FileTypeResponse) {
    return <div className="fixed inset-0 grid h-screen gap-1 text-center place-content-center">
        <p className="text-xl">Files of type &apos;{file.extension}&apos; are not supported</p>
        <p>You may <ApiFileDownloadLink className="text-blue-500 hover:underline" to={file.path}>download the file</ApiFileDownloadLink> if this helps</p>
    </div>;
}
