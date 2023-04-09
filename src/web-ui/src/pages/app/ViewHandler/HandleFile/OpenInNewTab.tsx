import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "~/common";
import { FileTypeResponse } from "~/types";


export default function OpenInNewTab(file: FileTypeResponse) {
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
