import { useState } from "react";
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
    return <div className={`relative group ${props.className}`}>
        <img className="w-full" src={FolderIconSrc} />
        {props.previewSrc &&
            <img className="absolute object-cover w-1/2 border border-black rounded-md top-1/2 left-1/2 -translate-x-[15%] -translate-y-1/3 aspect-square rotate-6" src={props.previewSrc} style={{display: success ? "block" : "none"}} onLoad={() => setSuccess(true)} />
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
