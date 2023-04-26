import { useEffect, useRef, useState } from "react";
import type { FileTypeResponse } from "~/api/types";
import { serverUrl } from "~/config";
import { formatDuration } from "~/common";
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
import { useSetting } from "~/hooks/useSettings";


interface Props {
    file?: FileTypeResponse
    className?: string
}


export default function FileIcon({ file, className }: Props) {
    const [previews] = useSetting("previews");
    const [imgSrc, setSrc] = useState((previews && file) ? serverUrl(`/preview/${file.path}`) : getIconForFile(file));
    const failed = useRef<boolean>(!previews || !file);

    useEffect(() => {
        if (previews && file) {
            setSrc(serverUrl(`/preview/${file.path}`));
            failed.current = false;
        } else {
            setSrc(getIconForFile(file));
            failed.current = true;
        }
    }, [previews]);

    return <div className="relative">
        <img className={className} src={imgSrc} onError={failed.current ? undefined : () => {
            setSrc(getIconForFile(file));
            failed.current = true;
        }} alt="" loading="lazy" />
        {(!!file?.has_video && !file.has_audio) &&
            <span className="absolute top-0 left-0 px-1 bg-black bg-opacity-40 rounded-br-md">
                <img className="h-4 invert" src={NoAudioIconSrc} alt="🔇" />
            </span>
        }
        {!!file?.size &&
            <span className="absolute top-0 right-0 px-1 text-xs bg-black bg-opacity-40 rounded-bl-md">{file.size.width}x{file.size.height}</span>
        }
        {/* TODO: file size */}
        {!!file?.duration &&
            <span className="absolute bottom-0 right-0 px-1 text-xs bg-black bg-opacity-40 rounded-tl-md">{formatDuration(file.duration)}</span>
        }
    </div>;
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
