import { Link } from "react-router-dom";
import { OpenMode } from "~/common";
import type { FileOrDirectory } from "~/types";
import type { ViewProps } from ".";
import FileIcon from "~/elements/FileIcon";
import useIsFullScreen from "~/hooks/useIsFullScreen";
import useOpenMode from "~/hooks/useOpenMode";
import { OpenModeLinkMap } from "~/common/maps";
import FolderIcon from "~/elements/FolderIcon";
import DownloadFailedIcon from "@assets/icons/download-fail.png";
import { useHref } from "react-router-dom";
import { serverUrl } from "~/config";


export default function GalleryView({ contents }: ViewProps) {
    const imageCount = contents.filter(item => item.type === "file" && item.mime?.startsWith("image/")).length;
    const otherCount = contents.length - imageCount;

    // comparing the ratio between image-files and other stuff (directories+files)
    if ((imageCount/otherCount) <= 1.0) {
        return <div className="grid gap-3 px-2 py-1 justify-evenly" style={{gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))"}}>
            {contents.map(item => <GridRenderItem key={item.path} {...item} />)}
        </div>;
    } else {
        return <div className="flex flex-col py-1">
            {contents.map(item => <ListRenderItem key={item.path} {...item} />)}
        </div>;
    }
}


function GridRenderItem(item: FileOrDirectory) {
    const [openMode] = useOpenMode();

    if (item.type === "directory") {
        return <Link to={item.path} className="flex flex-col gap-1 group">
            <FolderIcon previewSrc={serverUrl(`/preview/${item.path}?directories=true`)} />
            <span className="text-center break-words group-hover:underline">
                {item.basename}
            </span>
        </Link>;
    } else {
        const LinkComp = OpenModeLinkMap[openMode];
        return <LinkComp to={item.path} className="flex flex-col gap-1 group">
            <FileIcon className="object-cover w-full h-auto mx-auto rounded-lg aspect-square" imgSrc={serverUrl(`/preview/${item.path}`)} mime={item.mime} />
            <span className="w-full text-center break-words group-hover:underline">
                {item.basename}
            </span>
        </LinkComp>;
    }
}


function ListRenderItem(item: FileOrDirectory) {
    const [openMode] = useOpenMode();
    const isFullScreen = useIsFullScreen();
    const href = useHref(item.path);

    if (item.type === "directory") {
        return <Link to={item.path} className="flex gap-1 px-2 group">
            <FolderIcon className="w-auto h-6 aspect-square" />
            <span className="break-words group-hover:underline">
                {item.basename}
            </span>
        </Link>;
    } else if (item.mime?.startsWith("image/")) {
        const imgSrc = serverUrl(`/low-resolution/${item.path}`);

        const onError: React.ReactEventHandler<HTMLImageElement> = ({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src = DownloadFailedIcon;
        };

        return <img width={item.size?.[0] ?? 500} height={item.size?.[1] ?? 375} className={`w-full mx-auto ${isFullScreen ? "" : "max-w-5xl"}`}
            src={imgSrc} onError={onError} onClick={({ currentTarget }) => {
                if (currentTarget.onerror === null) {
                    const url = new URL(imgSrc);
                    url.searchParams.set("ts", Date.now().toString());
                    currentTarget.src = url.toString();
                    currentTarget.onerror = onError as never;
                }
            }} onDoubleClick={() => {
                const url = openMode === OpenMode.intern ? href : serverUrl(`/files/${item.path}`);
                window.open(url, "_blank")?.focus();
            }} alt="" loading="lazy"
        />;
    } else {
        const LinkComp = OpenModeLinkMap[openMode];
        return <LinkComp to={item.path} className="flex gap-1 px-2 group">
            <FileIcon className="w-auto h-6 my-auto aspect-square" mime={item.mime} />
            <span className="break-words group-hover:underline">
                {item.basename}
            </span>
        </LinkComp>;
    }
}
