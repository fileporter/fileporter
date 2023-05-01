import type { FileTypeResponse } from "~/api/types";

import ArchiveIcon from "@assets/icons/files/archive.png?inline";
import AudioIcon from "@assets/icons/files/audio-file.png?inline";
// import CloudIcon from "@assets/icons/files/cloud-file.png?inline";
import CodeIcon from "@assets/icons/files/code-file.png?inline";
import CodeLikeIcon from "@assets/icons/files/code-like-file.png?inline";
import DocumentIcon from "@assets/icons/files/document.png?inline";
import HotArticle from "@assets/icons/files/hot-article.png?inline";
import ImageIcon from "@assets/icons/files/image-file.png?inline";
import PdfDocumentIcon from "@assets/icons/files/pdf-file.png?inline";
import PolicyIcon from "@assets/icons/files/policy-document.png?inline";
import SymlinkIcon from "@assets/icons/files/symlink-file.png?inline";
import VideoIcon from "@assets/icons/files/video-file.png?inline";
import EmptyFileIcon from "@assets/icons/files/default-file.png?inline";

// XXX: maybe NameMap over props.imgSrc
const NameMap: Record<string, string> = {
    "LICENSE": PolicyIcon,
};
const MimeMap = {
    "application/json": CodeIcon,
    "application/pdf": PdfDocumentIcon,
    "application/": ArchiveIcon,
    "audio/": AudioIcon,
    "image/": ImageIcon,
    "video/": VideoIcon,
    "text/x-": CodeIcon,
    "text/markdown": HotArticle,
    "text/uri": SymlinkIcon,
    "text/html": CodeIcon,
    "text/css": CodeLikeIcon,
    "text/": DocumentIcon,
    "inode/": SymlinkIcon,
};


export function getIconForFile(file?: FileTypeResponse): string {
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
