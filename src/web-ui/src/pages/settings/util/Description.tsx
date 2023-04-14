import { type PropsWithChildren } from "react";


export default function Description(props: PropsWithChildren) {
    return <p className="text-sm text-center">{props.children}</p>;
}
