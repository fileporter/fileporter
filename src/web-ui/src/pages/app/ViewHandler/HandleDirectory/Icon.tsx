import type { FileOrDirectory } from "~/types";
import type { DirectoryHandlerProps } from "./types";
import { Link } from "react-router-dom";
import FolderIcon from "~/elements/FolderIcon";
import FileIcon from "~/elements/FileIcon";
import { serverUrl } from "~/config";
import OpenModeLink from "~/elements/OpenModeLink";


export default function IconView({ contents }: DirectoryHandlerProps) {
    return <div className="grid gap-3 px-2 py-1 justify-evenly" style={{gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))"}}>
        {contents.map(item => <RenderItem key={item.path} {...item} />)}
    </div>;
}


function RenderItem(item: FileOrDirectory) {
    if (item.type === "directory") {
        return <Link to={item.path} className="flex flex-col gap-1 group">
            <FolderIcon className="grid aspect-square place-content-center" />
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
