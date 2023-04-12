import { LinkProps } from "react-router-dom";
import { serverUrl } from "~/config";


export default function ApiFileLink(props: LinkProps) {
    return <a {...props} href={serverUrl(`/files/${props.to}`)} target="_blank" rel="noopener noreferrer">
        {props.children}
    </a>
}
