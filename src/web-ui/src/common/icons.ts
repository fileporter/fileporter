import type { DirectoryTypeResponse, FileTypeResponse } from "~/api/types";

import ArchiveIconSrc from "@assets/icons/files/archive.png?inline";
import AudioIconSrc from "@assets/icons/files/audio-file.png?inline";
// import CloudIconSrc from "@assets/icons/files/cloud-file.png?inline";
import CodeIconSrc from "@assets/icons/files/code-file.png?inline";
import CodeLikeIconSrc from "@assets/icons/files/code-like-file.png?inline";
import DocumentIconSrc from "@assets/icons/files/document.png?inline";
import HotArticleSrc from "@assets/icons/files/hot-article.png?inline";
import ImageIconSrc from "@assets/icons/files/image-file.png?inline";
import PdfDocumentIconSrc from "@assets/icons/files/pdf-file.png?inline";
import PolicyIconSrc from "@assets/icons/files/policy-document.png?inline";
import SymlinkIconSrc from "@assets/icons/files/symlink-file.png?inline";
import VideoIconSrc from "@assets/icons/files/video-file.png?inline";
import EmptyFileIconSrc from "@assets/icons/files/default-file.png?inline";

// XXX: maybe NameMap over props.imgSrc
const FileNameMap: Record<string, string> = {
    "LICENSE": PolicyIconSrc,
};
const MimeMap = {
    "application/json": CodeIconSrc,
    "application/pdf": PdfDocumentIconSrc,
    "application/": ArchiveIconSrc,
    "audio/": AudioIconSrc,
    "image/": ImageIconSrc,
    "video/": VideoIconSrc,
    "text/x-": CodeIconSrc,
    "text/markdown": HotArticleSrc,
    "text/uri": SymlinkIconSrc,
    "text/html": CodeIconSrc,
    "text/css": CodeLikeIconSrc,
    "text/": DocumentIconSrc,
    "inode/": SymlinkIconSrc,
};


export function getIconForFile(file?: FileTypeResponse): string {
    const filename = file?.basename;
    const mime = file?.mime;
    if (filename && Object.keys(FileNameMap).includes(filename)) {
        return FileNameMap[filename];
    }
    if (!mime) {
        return EmptyFileIconSrc;
    }
    for (const [pattern, icon] of Object.entries(MimeMap)) {
        if (mime.startsWith(pattern)) {
            return icon;
        }
    }
    return EmptyFileIconSrc;
}

import CodeFolderIconSrc from "@assets/icons/folders/code-folder.png?inline";
import DocumentsFolderIconSrc from "@assets/icons/folders/documents-folder.png?inline";
import DownloadFolderIconSrc from "@assets/icons/folders/download-folder.png?inline";
import GamesFolderIconSrc from "@assets/icons/folders/games-folder.png?inline";
import MusicFolderIconSrc from "@assets/icons/folders/music-folder.png?inline";
import PicturesFolderIconSrc from "@assets/icons/folders/pictures-folder.png?inline";
import PornFolderIconSrc from "@assets/icons/folders/porn-folder.png?inline";
// import TopSecrets1FolderIconSrc from "@assets/icons/folders/top-secrets-1.png?inline";
// import TopSecrets2FolderIconSrc from "@assets/icons/folders/top-secrets-2.png?inline";
import UserFolderIconSrc from "@assets/icons/folders/code-folder.png?inline";
import VideosFolderIconSrc from "@assets/icons/folders/videos-folder.png?inline";
import FolderIconSrc from "@assets/icons/folders/folder.png?inline";

const FolderNameMap: Record<string, undefined | string> = {
    "documents": DocumentsFolderIconSrc,
    "downloads": DownloadFolderIconSrc,
    "games": GamesFolderIconSrc,
    "music": MusicFolderIconSrc,
    "pictures": PicturesFolderIconSrc,
    "pics": PicturesFolderIconSrc,
    "pcs": PicturesFolderIconSrc,
    "comics": PicturesFolderIconSrc,
    "manga": PicturesFolderIconSrc,
    "images": PicturesFolderIconSrc,
    "videos": VideosFolderIconSrc,
    "anime": VideosFolderIconSrc,
    "node_modules": CodeFolderIconSrc,
    "venv": CodeFolderIconSrc,
    ".venv": CodeFolderIconSrc,
    "home": UserFolderIconSrc,
    "porn": PornFolderIconSrc,
    "prn": PornFolderIconSrc,
};

export function getIconForFolder(folder?: DirectoryTypeResponse): string {
    const foldername = folder?.basename.toLocaleLowerCase();
    if (foldername) {
        return FolderNameMap[foldername] ?? FolderIconSrc;
    }
    return FolderIconSrc;
}
