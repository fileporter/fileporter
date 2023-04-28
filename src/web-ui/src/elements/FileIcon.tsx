import { useRef, useState } from "react";
import type { FileTypeResponse } from "~/api/types";
import { serverUrl } from "~/config";
import { formatDuration } from "~/common";
import { useSetting } from "~/hooks/useSettings";
import useContextMenu from "~/hooks/useContextMenu";
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
import NoAudioIconSrc from "@assets/icons/no-sound.png?inline";
import NoVideoIconSrc from "@assets/icons/no-video.png?inline";
import { formatFileSize } from "~/common";


interface Props {
    file?: FileTypeResponse
    className?: string
}


function NA() {
    return <span className="opacity-50 select-none">N/A</span>;
}

function Icon(props: { src: string, title?: string }) {
    return <img className="h-4 invert" src={props.src} title={props.title} />;
}


export default function FileIcon({ file, className }: Props) {
    const setContextMenu = useContextMenu();
    const [previews] = useSetting("previews");
    const [imgSrc, setSrc] = useState((previews && file) ? serverUrl(`/preview/${file.path}`) : getIconForFile(file));
    const failed = useRef<boolean>(!previews || !file);

    // xxx: this should not be needed (settings is own tab and un-mounts) (only if it should be cross-tab synced)
    // useEffect(() => {
    //     if (previews && file) {
    //         setSrc(serverUrl(`/preview/${file.path}`));
    //         failed.current = false;
    //     } else {
    //         setSrc(getIconForFile(file));
    //         failed.current = true;
    //     }
    // }, [previews]);

    return <div className="relative" onContextMenu={!file ? undefined : (event) => {
        event.preventDefault();
        event.stopPropagation();
        setContextMenu(<FileContextMenu {...file} />);
    }}>
        <img className={className} src={imgSrc} onError={failed.current ? undefined : () => {
            setSrc(getIconForFile(file));
            failed.current = true;
        }} alt="" loading="lazy" />
        {(!!file?.has_video && !file.has_audio) &&
            <span className="absolute top-0 left-0 px-1 bg-black bg-opacity-40 rounded-br-md">
                <img className="h-4 pointer-events-none invert" src={NoAudioIconSrc} alt="🔇" />
            </span>
        }
        {!!file?.dimensions &&
            <span className="absolute top-0 right-0 px-1 text-xs bg-black bg-opacity-40 rounded-bl-md">{file.dimensions.width}x{file.dimensions.height}</span>
        }
        {/* TODO: file size */}
        {!!file?.duration &&
            <span className="absolute bottom-0 right-0 px-1 text-xs bg-black bg-opacity-40 rounded-tl-md">{formatDuration(file.duration)}</span>
        }
    </div>;
}

function FileContextMenu(file: FileTypeResponse) {
    return <>
        <img className="h-10 mx-auto" src={getIconForFile(file)} />
        <div className="grid grid-cols-[auto,1fr] gap-x-3">
            <b>Name</b>
            <span>{file.basename}</span>
            <b>Path</b>
            <span>{file.parent}</span>
            <b>Mime</b>
            {file.mime ? <span>{file.mime}</span> : <NA/>}
            <b>File-size</b>
            <span>{formatFileSize(file.size)}</span>
            <b>Dimensions</b>
            {file.dimensions ? <span>{file.dimensions.width}x{file.dimensions.height}</span> : <NA/>}
            <b>Duration</b>
            <span>{file.duration ? formatDuration(file.duration) : <NA/>}</span>
            <b>Other</b>
            <span className="flex gap-1">
                {!file.has_video && <Icon src={NoVideoIconSrc} title="No Video" />}
                {!file.has_audio && <Icon src={NoAudioIconSrc} title="No Audio" />}
            </span>
        </div>
    </>;
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


function getIconForFile(file?: FileTypeResponse): string {
    const filename = file?.basename;
    const mime = file?.mime;
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
