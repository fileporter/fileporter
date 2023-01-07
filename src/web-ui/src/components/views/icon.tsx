import { Link } from "react-router-dom";
import { apiUrl, sortItems } from "../../common";
import { FileOrDirectory } from "../../types";
import ApiFileLink from "../ApiFileLink";
import FileIcon from "../FileIcon";
import { ViewProps } from "./ViewManager";

import FolderIcon from "./images/folder.png";
import FolderOpenIcon from "./images/folder-open.png";


export default function IconView({ contents }: ViewProps) {

    return <div className="grid gap-2 px-2 py-1 justify-evenly" style={{gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))"}}>
        {contents.sort(sortItems).map(item => <RenderItem key={item.path} {...item} />)}
    </div>
}


function RenderItem(item: FileOrDirectory) {
    if (item.type === "directory") {
        return <Link to={item.path} className="flex flex-col gap-1 group">
            <img className="block w-full h-auto mx-auto aspect-square group-hover:hidden" src={FolderIcon} alt="" />
            <img className="hidden w-full h-auto mx-auto aspect-square group-hover:block" src={FolderOpenIcon} alt="" />
            <span className="text-center group-hover:underline">
                {item.basename}
            </span>
        </Link>
    } else {
        return <ApiFileLink to={item.path} className="flex flex-col gap-1 group">
            <FileIcon className="object-cover w-full h-auto mx-auto rounded-lg aspect-square" imgSrc={apiUrl(`/preview/${item.path}`)} mime={item.mime} /> 
            <span className="w-full text-center break-words group-hover:underline">
                {item.basename}
            </span>
        </ApiFileLink>
    }
}
