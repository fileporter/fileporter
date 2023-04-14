import { useState } from "react";
import ArchiveIcon from "@assets/icons/files/archive.png";
import AudioIcon from "@assets/icons/files/audio-file.png";
// import CloudIcon from "@assets/icons/files/cloud-file.png";
import CodeIcon from "@assets/icons/files/code-file.png";
import DocumentIcon from "@assets/icons/files/document.png";
import HotArticle from "@assets/icons/files/hot-article.png";
import ImageIcon from "@assets/icons/files/image-file.png";
import VideoIcon from "@assets/icons/files/video-file.png";
import EmptyFileIcon from "@assets/icons/files/default-file.png";


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
