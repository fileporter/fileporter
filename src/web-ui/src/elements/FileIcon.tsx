import ArchiveIcon from "@assets/files/archive.png";
import AudioIcon from "@assets/files/audio-file.png";
// import CloudIcon from "@assets/files/cloud-file.png";
import CodeIcon from "@assets/files/code-file.png";
import DocumentIcon from "@assets/files/document.png";
import HotArticle from "@assets/files/hot-article.png";
import ImageIcon from "@assets/files/image-file.png";
import VideoIcon from "@assets/files/video-file.png";
import EmptyFileIcon from "@assets/files/default-file.png";
import { useState } from "react";


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
    if (mime === undefined) {
        return EmptyFileIcon;
    }
    for (const [pattern, icon] of Object.entries(MimeMap)) {
        if (mime.startsWith(pattern)) {
            return icon;
        }
    }
    return EmptyFileIcon;
}
