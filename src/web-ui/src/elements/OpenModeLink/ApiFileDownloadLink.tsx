import { type LinkProps, resolvePath } from "react-router-dom";
import { serverUrl } from "~/config";


export default function ApiFileDownloadLink(props: LinkProps) {
    const path = resolvePath(props.to);
    // WARN: download attribute works only in same-origin
    return <a {...props} download href={serverUrl(`/files${path.pathname}`)} target="_blank" rel="noopener noreferrer" className={props.className}>
        {props.children}
    </a>;
}
