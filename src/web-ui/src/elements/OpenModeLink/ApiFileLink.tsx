import { resolvePath } from "react-router-dom";
import { type LinkProps } from "react-router-dom";
import { serverUrl } from "~/config";


export default function ApiFileLink(props: LinkProps) {
    // TODO: verify if this works
    const path = resolvePath(props.to);
    return <a {...props} href={serverUrl(`/files/${path.pathname}`)} target="_blank" rel="noopener noreferrer">
        {props.children}
    </a>;
}
