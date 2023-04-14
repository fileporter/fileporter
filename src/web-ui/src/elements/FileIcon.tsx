import { useState } from "react";
import ArchiveIcon from "@assets/icons/files/archive.png?inline";
import AudioIcon from "@assets/icons/files/audio-file.png?inline";
// import CloudIcon from "@assets/icons/files/cloud-file.png?inline";
import CodeIcon from "@assets/icons/files/code-file.png?inline";
import DocumentIcon from "@assets/icons/files/document.png?inline";
import HotArticle from "@assets/icons/files/hot-article.png?inline";
import ImageIcon from "@assets/icons/files/image-file.png?inline";
import VideoIcon from "@assets/icons/files/video-file.png?inline";
import EmptyFileIcon from "@assets/icons/files/default-file.png?inline";


interface Props {
    imgSrc?: string
    mime?: string
    className?: string
}


export default function FileIcon(props: Props) {
    const [imgSrc, setSrc] = useState(props.imgSrc ?? getIconFromMimeType(props.mime));
    const failed = imgSrc !== props.imgSrc;

    return <img className={`${failed ? "hue-rotate-color" : ""} ${props.className}`} src={imgSrc} onError={failed ? undefined : () => {
        setSrc(getIconFromMimeType(props.mime));
    }} alt="" loading="lazy" />;
}


const MimeMap = {
    "application/json": CodeIcon,
    "application/": ArchiveIcon,
    "audio/": AudioIcon,
    "image/": ImageIcon,
    "video/": VideoIcon,
    "text/x-": CodeIcon,
    "text/markdown": HotArticle,
    "text/": DocumentIcon,
};


function getIconFromMimeType(mime: string | undefined): string {
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
