import { LinkProps } from "react-router-dom";
import { serverUrl } from "~/config";


export default function ApiFileDownloadLink(props: LinkProps) {
    // WARN: download attribute works only in same-origin
    return <a {...props} download href={serverUrl(`/files/${props.to}`)} target="_blank" rel="noopener noreferrer" className={props.className}>
        {props.children}
    </a>
}
