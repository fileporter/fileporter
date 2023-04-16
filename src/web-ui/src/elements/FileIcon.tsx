import { useState } from "react";
import ArchiveIcon from "@assets/icons/files/archive.png?inline";
import AudioIcon from "@assets/icons/files/audio-file.png?inline";
// import CloudIcon from "@assets/icons/files/cloud-file.png?inline";
import CodeIcon from "@assets/icons/files/code-file.png?inline";
import DocumentIcon from "@assets/icons/files/document.png?inline";
import HotArticle from "@assets/icons/files/hot-article.png?inline";
import ImageIcon from "@assets/icons/files/image-file.png?inline";
import PolicyIcon from "@assets/icons/files/policy-document.png?inline";
import SymlinkIcon from "@assets/icons/files/symlink-file.png?inline";
import VideoIcon from "@assets/icons/files/video-file.png?inline";
import EmptyFileIcon from "@assets/icons/files/default-file.png?inline";


interface Props {
    imgSrc?: string
    filename?: string
    mime?: string
    className?: string
}


export default function FileIcon(props: Props) {
    const [imgSrc, setSrc] = useState(props.imgSrc ?? getIconFromMimeType(props.mime, props.filename));
    const failed = imgSrc !== props.imgSrc;

    return <img className={props.className} src={imgSrc} onError={failed ? undefined : () => {
        setSrc(getIconFromMimeType(props.mime, props.filename));
    }} alt="" loading="lazy" />;
}


// XXX: maybe NameMap over props.imgSrc
const NameMap: Record<string, string> = {
    "LICENSE": PolicyIcon,
};
const MimeMap = {
    "application/json": CodeIcon,
    "application/": ArchiveIcon,
    "audio/": AudioIcon,
    "image/": ImageIcon,
    "video/": VideoIcon,
    "text/x-": CodeIcon,
    "text/markdown": HotArticle,
    "text/uri": SymlinkIcon,
    "text/": DocumentIcon,
};


function getIconFromMimeType(mime: string | undefined, filename?: string): string {
    if (filename && Object.keys(NameMap).includes(filename)) {
        return NameMap[filename];
    }
    if (!mime) {
        return EmptyFileIcon;
    }
    for (const [pattern, icon] of Object.entries(MimeMap)) {
        if (mime.startsWith(pattern)) {
            return icon;
        }
    }
    return EmptyFileIcon;
}
