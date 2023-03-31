import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl, OpenMode } from "~/common";
import { FileTypeResponse } from "~/types";
import { MediaSupportIndex } from "~/components/SupportedMediaViews";
import FullScreenToggle from "~/components/ControlHeader/FullScreenToggle";
import useOpenMode from "~/hooks/useOpenMode";


export default function FileView(file: FileTypeResponse) {
    const [openMode] = useOpenMode();

    if (openMode === OpenMode.intern) {
        const MediaView = MediaSupportIndex[file.mime?.split("/")[0] ?? ""];
        if (MediaView) {
            return <>
                <FullScreenToggle />
                <MediaView {...file} />
            </>;
        }
    }
    return <OpenInNewTab {...file} />
}
function OpenInNewTab(file: FileTypeResponse) {
    const openNewTabRef = useRef(false);
    const navigate = useNavigate();

    // special way to prevent opening 2 tabs during development (React.StrictMode renders twice)
    useEffect(() => {
        if (!openNewTabRef.current) {
            openNewTabRef.current = true;
            window.open(apiUrl(`/files/${file.path}`), "_blank")?.focus();
            navigate(-1);
        }
    }, []);

    return null;
}
