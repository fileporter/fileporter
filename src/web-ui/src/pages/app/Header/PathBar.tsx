import React from "react";
import { Link } from "react-router-dom";
import usePath from "~/hooks/usePath";


export default function PathBar() {
    const path = usePath();

    const paths = path.split("/").filter(e => e.length);

    return <div className="flex flex-wrap gap-1 grow">
        <Link className="w-5 text-right" to="/">/</Link>
        {paths.map((p, i) => <React.Fragment key={i + p}>
            <Link to={paths.slice(0, i+1).join("/")} className="break-words hover:underline max-w-[45vw] whitespace-nowrap overflow-x-clip overflow-ellipsis">
                {decodeURIComponent(p)}
            </Link>
            {i < (paths.length - 1) && <span className="select-none">/</span>}
        </React.Fragment>)}
    </div>;
}
