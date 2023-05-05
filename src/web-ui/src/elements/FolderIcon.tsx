import { createRef, useState } from "react";
import { serverUrl } from "~/config";
import type { DirectoryTypeResponse } from "~/api/types";
import { useSetting } from "~/hooks/useSettings";
import useContextMenu from "~/hooks/useContextMenu";
import DirectoryContextMenu from "~/components/ContextMenu/DirectoryContextMenu";
import { getIconForFolder } from "~/common";


interface Props {
    directory?: DirectoryTypeResponse
    className?: string
}

// not animated (preview on directory pinned)
export default function FolderIcon({ directory, className }: Props) {
    const setContextMenu = useContextMenu();
    const [previews] = useSetting("previews");
    const previewSrc = (previews && directory) ? serverUrl(`/preview/${directory.path}?directories=true`) : undefined;
    const [success, setSuccess] = useState(false);
    const imgRef = createRef<HTMLImageElement>();
    // aspect > 1 == landscape | aspect < 1 == portrait
    const aspect = imgRef.current ? imgRef.current.naturalWidth / imgRef.current.naturalHeight : 1;

    return <div className={className} onContextMenu={!directory ? undefined : (event) => {
        event.preventDefault();
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
        setContextMenu(<DirectoryContextMenu {...directory} />);
    }}>
        <div className="relative group">
            <img className="w-full" src={success ? getIconForFolder() : getIconForFolder(directory)} alt="<folder>" />
            {previewSrc ? <img ref={imgRef} className="absolute object-cover h-3/5 border border-black rounded-md bottom-[10%] right-[10%] aspect-square rotate-6" src={previewSrc} alt="<preview>"
                style={{display: success ? "block" : "none", aspectRatio: aspect <= 1 ? "1 / 1" : "5 / 4"}}
                onLoad={() => setSuccess(true)} loading="lazy" /> : null
            }
        </div>
    </div>;
}
