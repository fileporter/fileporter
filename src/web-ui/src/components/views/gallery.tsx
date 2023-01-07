import { Link } from "react-router-dom";
import { apiUrl, sortItems } from "../../common";
import { FileOrDirectory } from "../../types";
import FolderIcon from "./images/folder.png";
import FolderOpenIcon from "./images/folder-open.png";
import DownloadFailed from "./images/download-fail.png"
import ApiFileLink from "../ApiFileLink";
import FileIcon from "../FileIcon";
import { ViewProps } from "./ViewManager";


export default function GalleryView({ contents }: ViewProps) {
    return <div className="flex flex-col py-1">
        {contents.sort(sortItems).map(item => <RenderItem key={item.path} {...item} />)}
    </div>
}

function RenderItem(item: FileOrDirectory) {
    if (item.type === "directory") {
        return <Link to={item.path} className="flex gap-1 px-2 group">
            <img className="block w-auto h-6 group-hover:hidden aspect-square" src={FolderIcon} alt="" />
            <img className="hidden w-auto h-6 group-hover:block aspect-square" src={FolderOpenIcon} alt="" />
            <span className="group-hover:underline">
                {item.basename}
            </span>
        </Link>
    } else if (item.mime?.startsWith("image/")) {
        console.log(item);
        return <img width={item.size?.[0] ?? 100} height={item.size?.[1] ?? 200} className="w-full max-w-5xl mx-auto"
            src={apiUrl(`/files/${item.path}`)} onError={({currentTarget}) => {
                currentTarget.onerror = null;
                currentTarget.src = DownloadFailed;
            }} alt="" onDoubleClick={() => window.open(apiUrl(`/files/${item.path}`), '_blank')?.focus()} loading="lazy"
        />
    } else {
        return <ApiFileLink to={item.path} className="flex gap-1 px-2 group">
            <FileIcon className="w-auto h-6 my-auto aspect-square" mime={item.mime} />
            <span className="group-hover:underline">
                {item.basename}
            </span>
        </ApiFileLink>
    }
}