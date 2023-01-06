import { Link, useLocation } from "react-router-dom";

export default function ControlButtons() {
    const location = useLocation();
    const path = location.pathname;

    return <div>
        {/* <Link to="/">←</Link> */}
        {/* <Link to="/">→</Link> */}
        <Link to={`.${path}/..`} className="w-auto h-auto text-black bg-gray-200 rounded-lg aspect-square">↑</Link>
    </div>
}
