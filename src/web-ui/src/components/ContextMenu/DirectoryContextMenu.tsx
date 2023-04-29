import type { DirectoryTypeResponse } from "~/api/types";
import FolderIconSrc from "@assets/icons/files/directory.png";


export default function DirectoryContextMenu(directory: DirectoryTypeResponse) {
    return <>
        <img className="mx-auto h-14" src={FolderIconSrc} />
        <div className="grid grid-cols-[auto,1fr] gap-x-3">
            <span>Name</span>
            <span>{directory.basename}</span>
            <span>Path</span>
            <span>{directory.parent}</span>
        </div>
    </>;
}
