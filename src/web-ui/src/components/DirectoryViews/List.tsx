import { Link } from "react-router-dom";
import type { FileOrDirectory } from "~/types";
import FileIcon from "~/elements/FileIcon";
import useOpenMode from "~/hooks/useOpenMode";
import type { ViewProps } from ".";
import { OpenModeLinkMap } from "~/common/maps";
import FolderIcon from "~/elements/FolderIcon";


export default function ListView({ contents }: ViewProps) {
    return <div className="flex flex-col gap-1 px-2 py-1">
        {contents.map(item => <RenderItem key={item.path} {...item} />)}
    </div>;
}


function RenderItem(item: FileOrDirectory) {
    const [openMode] = useOpenMode();

    if (item.type === "directory") {
        return <Link to={item.path} className="flex gap-1 group">
            <FolderIcon className="w-auto h-6 aspect-square" />
            <span className="break-words group-hover:underline">
                {item.basename}
            </span>
        </Link>;
    } else {
        const LinkComp = OpenModeLinkMap[openMode];
        return <LinkComp to={item.path} className="flex gap-1 group">
            <FileIcon className="w-auto h-6 my-auto aspect-square" mime={item.mime} />
            <span className="break-words group-hover:underline">
                {item.basename}
            </span>
        </LinkComp>;
    }
}
