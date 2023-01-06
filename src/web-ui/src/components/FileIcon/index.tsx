import ArchiveIcon from "./icons8-archive-96.png";
import AudioIcon from "./icons8-audio-file-96.png";
import ImageIcon from "./icons8-image-file-96.png";
import Videoicon from "./icons8-video-file-96.png";
import DocumentIcon from "./icons8-document-96.png";
import EmptyFileIcon from "./icons8-file-96.png";


interface Props {
    imgSrc?: string
    mime?: string
    className?: string
}

export default function FileIcon(props: Props) {
    function getIcon(): string {
        console.log(props.mime, props.mime?.split("/", 1))
        switch(props.mime?.split("/", 1)[0]) {
            case "application":
                return ArchiveIcon;
            case "audio":
                return AudioIcon;
            case "image":
                return ImageIcon;
            case "video":
                return Videoicon;
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
