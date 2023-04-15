import { Link } from "react-router-dom";
import { serverUrl } from "~/config";
import FileIcon from "~/elements/FileIcon";
import FolderIcon from "~/elements/FolderIcon";
import OpenModeLink from "~/elements/OpenModeLink";
import type { FileOrDirectory } from "~/types";


export default function GridModeRenderItem(item: FileOrDirectory) {
    if (item.type === "directory") {
        return <Link to={item.path} className="flex flex-col gap-1 group">
            <FolderIcon previewSrc={serverUrl(`/preview/${item.path}?directories=true`)} />
            <span className="text-center break-words group-hover:underline">
                {item.basename}
            </span>
        </Link>;
    } else {
        return <OpenModeLink to={item.path} className="flex flex-col gap-1 group">
            <FileIcon className="object-cover w-full h-auto mx-auto rounded-lg aspect-square" imgSrc={serverUrl(`/preview/${item.path}`)} mime={item.mime} />
            <span className="w-full text-center break-words group-hover:underline">
                {item.basename}
            </span>
        </OpenModeLink>;
    }
}
