import { Link } from "react-router-dom";
import { apiUrl, OpenMode } from "~/common";
import { FileOrDirectory } from "~/types";
import ApiFileLink from "../ApiFileLink";
import FileIcon from "../FileIcon";
import { ViewProps } from "./ViewManager";

import FolderIcon from "@assets/icons/folder.png";
import FolderOpenIcon from "@assets/icons/folder-open.png";


export default function IconView({ contents, openMode }: ViewProps) {

    return <div className="grid gap-3 px-2 py-1 justify-evenly" style={{gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))"}}>
        {contents.map(item => <RenderItem key={item.path} item={item} openMode={openMode} />)}
    </div>
}


interface RenderItemProps {
    item: FileOrDirectory
    openMode: OpenMode
}


function RenderItem(props: RenderItemProps) {
    const item = props.item;
    if (item.type === "directory") {
        return <Link to={item.path} className="flex flex-col gap-1 group">
            <img className="block w-full h-auto mx-auto aspect-square group-hover:hidden" src={FolderIcon} alt="" />
            <img className="hidden w-full h-auto mx-auto aspect-square group-hover:block" src={FolderOpenIcon} alt="" />
            <span className="text-center break-words group-hover:underline">
                {item.basename}
            </span>
        </Link>
    } else {
        const LinkComp = props.openMode === OpenMode.intern ? Link : ApiFileLink;
        return <LinkComp to={item.path} className="flex flex-col gap-1 group">
            <FileIcon className="object-cover w-full h-auto mx-auto rounded-lg aspect-square" imgSrc={apiUrl(`/preview/${item.path}`)} mime={item.mime} /> 
            <span className="w-full text-center break-words group-hover:underline">
                {item.basename}
            </span>
        </LinkComp>
    }
}
