import { type LinkProps, Link, resolvePath } from "react-router-dom";


export default function InternLink(props: LinkProps) {
    const path = resolvePath(props.to, "/~/");
    return <Link {...props} to={path}>
        {props.children}
    </Link>;
}
