import { useRef, useState } from "react";
import type { FileTypeResponse } from "~/api/types";
import { serverUrl } from "~/config";
import { formatDuration, getIconForFile } from "~/common";
import { useSetting } from "~/hooks/useSettings";
import useContextMenu from "~/hooks/useContextMenu";
import { formatFileSize } from "~/common";
import FileContextMenu from "~/components/ContextMenu/FileContextMenu";
import NoAudioIconSrc from "@assets/icons/no-sound.png?inline";


interface Props {
    file?: FileTypeResponse
    forceIcon?: boolean
    className?: string
}


export default function FileIcon({ file, forceIcon, className }: Props) {
    const setContextMenu = useContextMenu();
    const [previews] = useSetting("previews");
    const allowPreview = !forceIcon && !!previews && !!file;
    const [imgSrc, setSrc] = useState(allowPreview ? serverUrl(`/preview/${file.path}`) : getIconForFile(file));
    const failed = useRef<boolean>(!allowPreview);

    // xxx: this should not be needed (settings is own tab and un-mounts) (only if it should be cross-tab synced)
    // useEffect(() => {
    //     if (previews && file) {
    //         setSrc(serverUrl(`/preview/${file.path}`));
    //         failed.current = false;
    //     } else {
    //         setSrc(getIconForFile(file));
    //         failed.current = true;
    //     }
    // }, [previews]);

    return <div className="relative" onContextMenu={!file ? undefined : (event) => {
        event.preventDefault();
        event.stopPropagation();
        setContextMenu(<FileContextMenu {...file} />);
    }}>
        <img className={className} src={imgSrc} onError={failed.current ? undefined : () => {
            setSrc(getIconForFile(file));
            failed.current = true;
        }} alt="" loading="lazy" />
        {!!allowPreview && <>
            {(!!file.has_video && !file.has_audio) &&
                <span className="absolute top-0 left-0 px-1 bg-black bg-opacity-40 rounded-br-md"><img className="h-4 pointer-events-none invert" src={NoAudioIconSrc} alt="🔇" /></span>
            }
            {!!file.dimensions &&
                <span className="absolute top-0 right-0 px-1 text-xs bg-black bg-opacity-40 rounded-bl-md">{file.dimensions.width}x{file.dimensions.height}</span>
            }
            {!!file.size &&
                <span className="absolute bottom-0 left-0 px-1 text-xs bg-black bg-opacity-40 rounded-tr-md">{formatFileSize(file.size)}</span>
            }
            {!!file.duration &&
                <span className="absolute bottom-0 right-0 px-1 text-xs bg-black bg-opacity-40 rounded-tl-md">{formatDuration(file.duration)}</span>
            }
        </>}
    </div>;
}
