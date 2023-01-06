import { Link, useLocation } from "react-router-dom"


export default function PathBar() {
    const location = useLocation();
    const path = location.pathname;

    const paths = path.split("/").filter(e => e.length);

    return <div className="flex gap-1 grow">
        <Link className="w-5 text-right" to="/">/</Link>
        {paths.map((p, i) => <>
            <Link key={p} to={paths.slice(0, i+1).join("/")} className="hover:underline">
                {p}
            </Link>
            <span className="select-none">/</span>
        </>)}
    </div>
}
