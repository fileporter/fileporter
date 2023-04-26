import { useRef, useState } from "react";
import FolderIconSrc from "@assets/icons/files/directory.png";
import { serverUrl } from "~/config";
import type { DirectoryTypeResponse } from "~/api/types";
import { useSetting } from "~/hooks/useSettings";


interface Props {
    directory?: DirectoryTypeResponse
    className?: string
}

// not animated (preview on directory pinned)
export default function FolderIcon({ directory, className }: Props) {
    const [preview] = useSetting("preview");
    const previewSrc = (preview && directory) ? serverUrl(`/preview/${directory.path}?directories=true`) : undefined;
    const [success, setSuccess] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);
    // aspect > 1 == landscape | aspect < 1 == portrait
    const aspect = imgRef.current ? imgRef.current.naturalWidth / imgRef.current.naturalHeight : 1;

    return <div className={className}>
        <div className="relative group">
            <img className="w-full" src={FolderIconSrc} alt="<folder>" />
            {previewSrc ? <img ref={imgRef} className="absolute object-cover h-3/5 border border-black rounded-md bottom-[10%] right-[10%] aspect-square rotate-6" src={previewSrc} alt="<preview>"
                style={{display: success ? "block" : "none", aspectRatio: aspect <= 1 ? "1 / 1" : "5 / 4"}}
                onLoad={() => setSuccess(true)} loading="lazy" /> : null
            }
        </div>
    </div>;
    // return <div className={`aspect-square grid place-content-center ${props.className}`}>
    //     <div className="relative group">
    //         <img className="w-full" src={FolderIconSrc} />
    //         {props.previewSrc ? <img ref={imgRef} className="absolute object-cover h-3/5 border border-black rounded-md bottom-[10%] right-[10%] aspect-square rotate-6" src={props.previewSrc}
    //             style={{display: success ? "block" : "none", aspectRatio: aspect <= 1 ? "1 / 1" : "5 / 4"}}
    //             onLoad={() => setSuccess(true)} loading="lazy" /> : null
    //         }
    //     </div>
    // </div>;
}
