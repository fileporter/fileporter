import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "~/config";
import type { FileTypeResponse } from "~/types";


export default function OpenInNewTab(file: FileTypeResponse) {
    const openNewTabRef = useRef(false);
    const navigate = useNavigate();

    // special way to prevent opening 2 tabs during development (React.StrictMode renders twice)
    useEffect(() => {
        if (!openNewTabRef.current) {
            openNewTabRef.current = true;
            window.open(serverUrl(`/files/${file.path}`), "_blank")?.focus();
            navigate(-1);
        }
    }, []);

    return null;
}
