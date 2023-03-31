import { Link } from "react-router-dom";
import { apiUrl } from "~/common";
import { FileOrDirectory } from "~/types";
import FileIcon from "~/elements/FileIcon";
import useOpenMode from "~/hooks/useOpenMode";
import { ViewProps } from ".";
import { OpenModeLinkMap } from "~/common/maps";
import FolderIcon from "~/elements/FolderIcon";


export default function IconView({ contents }: ViewProps) {

    return <div className="grid gap-3 px-2 py-1 justify-evenly" style={{gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))"}}>
        {contents.map(item => <RenderItem key={item.path} {...item} />)}
    </div>
}


function RenderItem(item: FileOrDirectory) {
    const [openMode] = useOpenMode();

    if (item.type === "directory") {
        return <Link to={item.path} className="flex flex-col gap-1 group">
            <FolderIcon previewSrc={apiUrl(`/preview/${item.path}?directories=true`)} />
            <span className="text-center break-words group-hover:underline">
                {item.basename}
            </span>
        </Link>
    } else {
        const LinkComp = OpenModeLinkMap[openMode];
        return <LinkComp to={item.path} className="flex flex-col gap-1 group">
            <FileIcon className="object-cover w-full h-auto mx-auto rounded-lg aspect-square" imgSrc={apiUrl(`/preview/${item.path}`)} mime={item.mime} /> 
            <span className="w-full text-center break-words group-hover:underline">
                {item.basename}
            </span>
        </LinkComp>
    }
}
