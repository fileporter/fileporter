import { useState } from "react";
import { apiUrl } from "~/common/";
import { FileTypeResponse } from "~/types";


export default function ImageSupport(file: FileTypeResponse) {
    const [useFullView, setFullView] = useState(true);
    const srcUrl = apiUrl(`/files/${file.path}`);

    function toggleView() {
        setFullView(!useFullView);
    }

    const size = {width: file.size?.[0], height: file.size?.[1]};

    if (useFullView) {
        return <div className="fixed inset-0 w-screen h-screen bg-black">
            <img {...size} className="object-contain w-full h-full" onClick={toggleView} src={srcUrl} alt="" />
        </div>
    } else {
        return <img {...size} className="w-full h-full" onClick={toggleView} src={srcUrl} alt="" />;
    }
}
