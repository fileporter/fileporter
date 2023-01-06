import { useLocation } from "react-router-dom"


export default function PathBar() {
    const location = useLocation();
    const path = location.pathname;

    return <div className="flex gap-2 px-2 py-px bg-black rounded-md bg-opacity-30">
        {/* {path.split("/").map(p => <div key={p}>{p}</div>)} */}
        {path}
    </div>
}
