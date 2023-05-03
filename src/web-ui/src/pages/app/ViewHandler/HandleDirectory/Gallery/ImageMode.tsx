import { Link, useNavigate } from "react-router-dom";
import { serverUrl } from "~/config";
import FolderIcon from "~/elements/FolderIcon";
import useIsFullScreen from "~/hooks/useIsFullScreen";
import type { FileOrDirectory } from "~/api/types";
import OpenModeLink from "~/elements/OpenModeLink";
import FileIcon from "~/elements/FileIcon";
import DownloadFailedIcon from "@assets/icons/download-fail.png";


export default function ImageModeRenderItem(item: FileOrDirectory) {
    const isFullScreen = useIsFullScreen();
    const navigate = useNavigate();

    if (item.type === "directory") {
        return <Link to={`/~/${item.path}`} className="flex gap-1 px-2 group">
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

        return <img width={item.dimensions?.width ?? 500} height={item.dimensions?.height ?? 375} className={`w-full mx-auto ${isFullScreen ? "" : "max-w-5xl"}`}
            src={imgSrc} onError={onError} onClick={({ currentTarget }) => {
                if (currentTarget.onerror === null) {
                    const url = new URL(imgSrc);
                    url.searchParams.set("ts", Date.now().toString());
                    currentTarget.src = url.toString();
                    currentTarget.onerror = onError as never;
                }
            }} onDoubleClick={() => {
                // const url = openMode === OpenMode.intern ? href : serverUrl(`/files/${item.path}`);
                // window.open(url, "_blank")?.focus();
                navigate(`/~/${item.realpath}`);
            }} alt="" loading="lazy"
        />;
    } else {
        return <OpenModeLink to={`/~/${item.realpath}`} className="flex gap-1 px-2 group">
            <FileIcon className="w-auto h-6 my-auto aspect-square" file={item} />
            <span className="break-words group-hover:underline">
                {item.basename}
            </span>
        </OpenModeLink>;
    }
}
