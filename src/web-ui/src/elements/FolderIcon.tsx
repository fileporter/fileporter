import { useRef, useState } from "react";
import FolderIconSrc from "@assets/icons/files/directory.png";


interface Props {
    previewSrc?: string
    className?: string
}

// not animated (preview on directory pinned)
export default function FolderIcon(props: Props) {
    const [success, setSuccess] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);
    // aspect > 1 == landscape | aspect < 1 == portrait
    const aspect = imgRef.current ? imgRef.current.naturalWidth / imgRef.current.naturalHeight : 1;

    return <div className={props.className}>
        <div className="relative group">
            <img className="w-full" src={FolderIconSrc} />
            {props.previewSrc ? <img ref={imgRef} className="absolute object-cover h-3/5 border border-black rounded-md bottom-[10%] right-[10%] aspect-square rotate-6" src={props.previewSrc}
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
