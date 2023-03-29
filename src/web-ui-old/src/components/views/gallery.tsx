import { Link } from "react-router-dom";
import { apiUrl, OpenMode } from "../../common";
import { FileOrDirectory } from "../../types";
import { ViewProps } from "./ViewManager";
import ApiFileLink from "../ApiFileLink";
import FileIcon from "../FileIcon";

import FolderIcon from "./images/folder.png";
import FolderOpenIcon from "./images/folder-open.png";
import DownloadFailedIcon from "./images/download-fail.png";
import useIsFullScreen from "../../hooks/useIsFullScreen";



export default function GalleryView({ contents, openMode }: ViewProps) {
    return <div className="flex flex-col py-1">
        {contents.map(item => <RenderItem key={item.path} item={item} openMode={openMode} />)}
    </div>
}


interface RenderItemProps {
    item: FileOrDirectory
    openMode: OpenMode
}


function RenderItem(props: RenderItemProps) {
    const item = props.item;
    const isFullScreen = useIsFullScreen();

    if (item.type === "directory") {
        return <Link to={item.path} className="flex gap-1 px-2 group">
            <img className="block w-auto h-6 group-hover:hidden aspect-square" src={FolderIcon} alt="" />
            <img className="hidden w-auto h-6 group-hover:block aspect-square" src={FolderOpenIcon} alt="" />
            <span className="group-hover:underline">
                {item.basename}
            </span>
        </Link>
    } else if (item.mime?.startsWith("image/")) {
        const imgSrc = apiUrl(`/low-resolution/${item.path}`);

        const onError: React.ReactEventHandler<HTMLImageElement> = ({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src = DownloadFailedIcon;
        }

        return <img width={item.size?.[0] ?? 320} height={item.size?.[1] ?? 180} className={`w-full mx-auto ${isFullScreen ? "" : "max-w-5xl"}`}
            src={imgSrc} onError={onError} onClick={({ currentTarget }) => {
                if (currentTarget.onerror === null) {
                    const url = new URL(imgSrc);
                    url.searchParams.set("ts", Date.now().toString())
                    currentTarget.src = url.toString();
                    currentTarget.onerror = onError as never;
                }
            }} onDoubleClick={() => {
                if (props.openMode === OpenMode.intern) {
                    window.open(`/#/${item.path}`, '_blank')?.focus();
                } else {
                    window.open(apiUrl(`/files/${item.path}`), '_blank')?.focus();
                }
            }} alt="" loading="lazy"
        />
    } else {
        const LinkComp = props.openMode === OpenMode.intern ? Link : ApiFileLink;
        return <LinkComp to={item.path} className="flex gap-1 px-2 group">
            <FileIcon className="w-auto h-6 my-auto aspect-square" mime={item.mime} />
            <span className="group-hover:underline">
                {item.basename}
            </span>
        </LinkComp>
    }
}
