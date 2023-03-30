import ArchiveIcon from "@assets/files/archive.png";
import AudioIcon from "@assets/files/audio-file.png";
import ImageIcon from "@assets/files/image-file.png";
import VideoIcon from "@assets/files/video-file.png";
import DocumentIcon from "@assets/files/document.png";
import EmptyFileIcon from "@assets/files/default-file.png";


interface Props {
    imgSrc?: string
    mime?: string
    className?: string
}

export default function FileIcon(props: Props) {
    function getIcon(): string {
        switch(props.mime?.split("/", 1)[0]) {
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

    return <img className={props.className} src={props.imgSrc ?? getIcon()} onError={({ currentTarget }) => {
        currentTarget.onerror = null;
        currentTarget.src = getIcon();
    }} alt="" loading="lazy" />;
}
