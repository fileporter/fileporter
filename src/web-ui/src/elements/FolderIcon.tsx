import { useRef, useState } from "react";
import FolderIconSrc from "@assets/files/directory.png";
// import FolderBackgroundSrc from "@assets/files/folder-background.png";
// import FolderFrontClosedSrc from "@assets/files/folder-front-closed.png";
// import FolderFrontOpenSrc from "@assets/files/folder-front-open.png";


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

    return <div className={`relative group ${props.className}`}>
        <img className="w-full" src={FolderIconSrc} />
        {props.previewSrc &&
            <img ref={imgRef} className="absolute object-cover h-3/5 border border-black rounded-md bottom-[10%] right-[10%] aspect-square rotate-6" src={props.previewSrc}
            style={{display: success ? "block" : "none", aspectRatio: aspect <= 1 ? "1 / 1" : "5 / 4"}}
            onLoad={() => setSuccess(true)} />
        }
    </div>;
}

// animated on hovering (preview inside of directory)
// export default function FolderIcon(props: Props) {
//     return <div className={`relative group ${props.className}`}>
//         <img className="w-full" src={FolderBackgroundSrc} />
//         {props.previewSrc &&
//             <img className="absolute object-cover w-7/12 border border-black rounded-md top-1 right-2 aspect-square rotate-6" src={props.previewSrc} onError={e => e.currentTarget.style.display = 'none'} />
//         }
//         <img className="absolute inset-0 block w-full group-hover:hidden hue-rotate-color" src={FolderFrontClosedSrc} />
//         <img className="absolute inset-0 hidden w-full group-hover:block hue-rotate-color" src={FolderFrontOpenSrc} />
//     </div>;
// }
