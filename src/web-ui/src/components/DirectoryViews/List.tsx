import { Link } from "react-router-dom";
import { FileOrDirectory } from "~/types";
import ApiFileLink from "../../elements/ApiFileLink";
import { OpenMode } from "~/common";

import FolderIcon from "@assets/icons/folder.png";
import FolderOpenIcon from "@assets/icons/folder-open.png";
import FileIcon from "../../elements/FileIcon";
import { ViewProps } from "./ViewManager";
import useOpenMode from "~/hooks/useOpenMode";


export default function ListView({ contents }: ViewProps) {
    return <div className="flex flex-col gap-1 px-2 py-1">
        {contents.map(item => <RenderItem key={item.path} {...item} />)}
    </div>
}


function RenderItem(item: FileOrDirectory) {
    const [openMode] = useOpenMode();

    if (item.type === "directory") {
        return <Link to={item.path} className="flex gap-1 group">
            <img className="block w-auto h-6 group-hover:hidden aspect-square" src={FolderIcon} alt="" />
            <img className="hidden w-auto h-6 group-hover:block aspect-square" src={FolderOpenIcon} alt="" />
            <span className="break-words group-hover:underline">
                {item.basename}
            </span>
        </Link>
    } else {
        const LinkComp = openMode === OpenMode.intern ? Link : ApiFileLink;
        return <LinkComp to={item.path} className="flex gap-1 group">
            <FileIcon className="w-auto h-6 my-auto aspect-square" mime={item.mime} />
            {/* <img className="w-auto h-6 aspect-square" src={FileIcon} alt="" /> */}
            <span className="break-words group-hover:underline">
                {item.basename}
            </span>
        </LinkComp>
    }
}
