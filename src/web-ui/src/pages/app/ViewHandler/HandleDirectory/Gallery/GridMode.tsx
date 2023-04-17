import { Link } from "react-router-dom";
import FileIcon from "~/elements/FileIcon";
import FolderIcon from "~/elements/FolderIcon";
import OpenModeLink from "~/elements/OpenModeLink";
import type { FileOrDirectory } from "~/types";


export default function GridModeRenderItem(item: FileOrDirectory) {
    if (item.type === "directory") {
        return <Link to={item.path} className="flex flex-col gap-1 group">
            <FolderIcon className="grid aspect-square place-content-center" directory={item} />
            <span className="text-center break-words group-hover:underline">
                {item.basename}
            </span>
        </Link>;
    } else {
        return <OpenModeLink to={item.path} className="flex flex-col gap-1 group">
            <FileIcon className="object-cover w-full h-auto mx-auto rounded-lg aspect-square" file={item} />
            <span className="w-full text-center break-words group-hover:underline">
                {item.basename}
            </span>
        </OpenModeLink>;
    }
}
