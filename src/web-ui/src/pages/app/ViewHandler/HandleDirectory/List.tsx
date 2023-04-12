import type { FileOrDirectory } from "~/types";
import type { DirectoryHandlerProps } from "./types";
import { Link } from "react-router-dom";
import FolderIcon from "~/elements/FolderIcon";
import FileIcon from "~/elements/FileIcon";
import OpenModeLink from "~/elements/OpenModeLink";


export default function ListView({ contents }: DirectoryHandlerProps) {
    return <div className="flex flex-col gap-1 px-2 py-1">
        {contents.map(item => <RenderItem key={item.path} {...item} />)}
    </div>;
}


function RenderItem(item: FileOrDirectory) {
    if (item.type === "directory") {
        return <Link to={item.path} className="flex gap-1 group">
            <FolderIcon className="w-auto h-6 aspect-square" />
            <span className="break-words group-hover:underline">
                {item.basename}
            </span>
        </Link>;
    } else {
        return <OpenModeLink to={item.path} className="flex gap-1 group">
            <FileIcon className="w-auto h-6 my-auto aspect-square" mime={item.mime} />
            <span className="break-words group-hover:underline">
                {item.basename}
            </span>
        </OpenModeLink>;
    }
}
