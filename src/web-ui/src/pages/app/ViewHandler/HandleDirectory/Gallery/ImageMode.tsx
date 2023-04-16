import { Link, useHref } from "react-router-dom";
import { serverUrl } from "~/config";
import FolderIcon from "~/elements/FolderIcon";
import useIsFullScreen from "~/hooks/useIsFullScreen";
import useOpenMode from "~/hooks/useOpenMode";
import type { FileOrDirectory } from "~/types";
import DownloadFailedIcon from "@assets/icons/download-fail.png";
import { OpenMode } from "~/common";
import OpenModeLink from "~/elements/OpenModeLink";
import FileIcon from "~/elements/FileIcon";


export default function ImageModeRenderItem(item: FileOrDirectory) {
    const [openMode] = useOpenMode();
    const isFullScreen = useIsFullScreen();
    const href = useHref(item.path);

    if (item.type === "directory") {
        return <Link to={item.path} className="flex gap-1 px-2 group">
            <FolderIcon className="w-auto h-6 aspect-square" />
            <span className="break-words group-hover:underline">
                {item.basename}
            </span>
        </Link>;
    } else if (item.mime?.startsWith("image/")) {
        const imgSrc = serverUrl(`/low-resolution/${item.path}`);

        const onError: React.ReactEventHandler<HTMLImageElement> = ({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src = DownloadFailedIcon;
        };

        return <img width={item.size?.[0] ?? 500} height={item.size?.[1] ?? 375} className={`w-full mx-auto ${isFullScreen ? "" : "max-w-5xl"}`}
            src={imgSrc} onError={onError} onClick={({ currentTarget }) => {
                if (currentTarget.onerror === null) {
                    const url = new URL(imgSrc);
                    url.searchParams.set("ts", Date.now().toString());
                    currentTarget.src = url.toString();
                    currentTarget.onerror = onError as never;
                }
            }} onDoubleClick={() => {
                const url = openMode === OpenMode.intern ? href : serverUrl(`/files/${item.path}`);
                window.open(url, "_blank")?.focus();
            }} alt="" loading="lazy"
        />;
    } else {
        return <OpenModeLink to={item.path} className="flex gap-1 px-2 group">
            <FileIcon className="w-auto h-6 my-auto aspect-square" mime={item.mime} filename={item.filename} />
            <span className="break-words group-hover:underline">
                {item.basename}
            </span>
        </OpenModeLink>;
    }
}
