import { PropsWithChildren } from "react";
import { apiUrl } from "~/common";


interface Props extends PropsWithChildren {
    to: string
    className?: string
}


export default function ApiFileLink(props: Props) {
    return <a href={apiUrl(`/files/${props.to}`)} target="_blank" rel="noopener noreferrer" className={props.className}>
        {props.children}
    </a>
}
