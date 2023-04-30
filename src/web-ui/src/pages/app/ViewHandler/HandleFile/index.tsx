import React, { Suspense } from "react";
import type { FileTypeResponse } from "~/api/types";
import ApiFileDownloadLink from "~/elements/OpenModeLink/ApiFileDownloadLink";
import Loading from "~/elements/Loading";
import { useSetting } from "~/hooks/useSettings";
const PdfSupport = React.lazy(() => import("./subtype/pdf"));
const AudioSupport = React.lazy(() => import("./type/Audio"));
const ImageSupport = React.lazy(() => import("./type/Image"));
const TextSupport = React.lazy(() => import("./type/Text"));
const VideoSupport = React.lazy(() => import("./type/Video"));
const DotJsonSupport = React.lazy(() => import("./subtype/json"));
const DotMarkdownSupport = React.lazy(() => import("./subtype/md"));
const DotUrlSupport = React.lazy(() => import("./subtype/url"));


type Index = Record<string, undefined | React.LazyExoticComponent<((p: FileTypeResponse) => JSX.Element)>>

export const MimeSubtypeSupportIndex: Index = {
    "application/json": DotJsonSupport,
    "application/xml": TextSupport,
    "application/pdf": PdfSupport,
    "text/xml": TextSupport, // still used sometimes but deprecated
    "text/markdown": DotMarkdownSupport,
    "text/uri": DotUrlSupport,
};
export const MimeTypeSupportIndex: Index = {
    audio: AudioSupport,
    image: ImageSupport,
    text: TextSupport,
    video: VideoSupport,
};


export default function HandleFile(file: FileTypeResponse) {
    const [gifLike] = useSetting("gifLike");
    if (!file.mime) {
        return <UnsupportedMessage {...file} />;
    }
    // this is a special case
    if (gifLike && file.has_video && !file.has_audio && file.duration && file.duration <= 60) {
        return <ImageSupport key={file.path} {...file} />; // this video is handled like a gif
    }
    const mimeStart = file.mime.split("/", 1)[0];
    const ViewComponent = MimeSubtypeSupportIndex[file.mime] ?? MimeTypeSupportIndex[mimeStart] ?? UnsupportedMessage;
    return <Suspense fallback={<Loading />}>
        <ViewComponent key={file.path} {...file} />
    </Suspense>;
}

function UnsupportedMessage(file: FileTypeResponse) {
    return <div className="fixed inset-0 grid h-screen gap-1 text-center place-content-center">
        <p className="text-xl">Files of type &apos;{file.extension}&apos; are not supported</p>
        <p>You may <ApiFileDownloadLink className="text-link hover:underline" to={file.path}>download the file</ApiFileDownloadLink> if this helps</p>
    </div>;
}
