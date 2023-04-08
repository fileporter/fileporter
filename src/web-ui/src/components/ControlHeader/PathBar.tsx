import React from "react";
import { Link, useLocation } from "react-router-dom"
import usePath from "~/hooks/usePath";


export default function PathBar() {
    const path = usePath();

    const paths = path.split("/").filter(e => e.length);

    return <div className="flex flex-wrap order-5 gap-1 grow">
        <Link className="w-5 text-right" to="/">/</Link>
        {paths.map((p, i) => <React.Fragment key={p}>
            <Link to={paths.slice(0, i+1).join("/")} className="break-words hover:underline max-w-[50vw] whitespace-nowrap overflow-x-clip overflow-ellipsis">
                {decodeURI(p)}
            </Link>
            <span className="select-none">/</span>
        </React.Fragment>)}
    </div>
}
