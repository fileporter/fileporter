import { Link, useNavigate } from "react-router-dom";
import { serverUrl } from "~/config";
import FolderIcon from "~/elements/FolderIcon";
import useIsFullScreen from "~/hooks/useIsFullScreen";
import type { FileOrDirectory } from "~/api/types";
import OpenModeLink from "~/elements/OpenModeLink";
import FileIcon from "~/elements/FileIcon";
import Image from "~/elements/Image";


export default function ImageModeRenderItem(item: FileOrDirectory) {
    const isFullScreen = useIsFullScreen();
    const navigate = useNavigate();

    if (item.type === "directory") {
        return <Link to={item.path} className="flex gap-1 px-2 group">
            <FolderIcon className="w-auto h-6 aspect-square" />
            <span className="break-words group-hover:underline">
                {item.basename}
            </span>
        </Link>;
    } else if (item.mime?.startsWith("image/")) {
        return <Image
            width={item.dimensions?.width} height={item.dimensions?.height}
            src={serverUrl(`/low-resolution/${item.path}`)} alt=""
            className={`w-full mx-auto ${isFullScreen ? "" : "max-w-5xl"}`}
            onDoubleClick={() => {
                // const url = openMode === OpenMode.intern ? href : serverUrl(`/files/${item.path}`);
                // window.open(url, "_blank")?.focus();
                navigate(`/~/${item.path}`);
            }}
        />;
    } else {
        return <OpenModeLink to={item.path} className="flex gap-1 px-2 group">
            <FileIcon className="w-auto h-6 my-auto aspect-square" file={item} />
            <span className="break-words group-hover:underline">
                {item.basename}
            </span>
        </OpenModeLink>;
    }
}
