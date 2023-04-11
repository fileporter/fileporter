import type { PropsWithChildren } from "react";
import { apiUrl } from "~/common";


interface Props extends PropsWithChildren {
    to: string
    className?: string
}


export default function ApiFileDownloadLink(props: Props) {
    // WARN: download attribute works only in same-origin
    return <a download href={apiUrl(`/files/${props.to}`)} target="_blank" rel="noopener noreferrer" className={props.className}>
        {props.children}
    </a>;
}
