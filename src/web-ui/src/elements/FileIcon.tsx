import ArchiveIcon from "@assets/files/archive.png";
import AudioIcon from "@assets/files/audio-file.png";
import ImageIcon from "@assets/files/image-file.png";
import VideoIcon from "@assets/files/video-file.png";
import DocumentIcon from "@assets/files/document.png";
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
        setSrc(getIconFromMimeType(props.mime))
    }} alt="" loading="lazy" />;
}

function getIconFromMimeType(mime: string | undefined): string {
    switch(mime?.split("/", 1)[0]) {
        case "application":
            return ArchiveIcon;
        case "audio":
            return AudioIcon;
        case "image":
            return ImageIcon;
        case "video":
            return VideoIcon;
        case "text":
            return DocumentIcon;
        default:
            return EmptyFileIcon;
    }
}
