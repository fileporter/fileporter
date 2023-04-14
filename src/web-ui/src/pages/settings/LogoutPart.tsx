import { Link } from "react-router-dom";
import LogoutIconSrc from "@assets/icons/logout-icon.png?inline";


export default function LogoutPart() {
    return <>
        <Link className="w-full max-w-xs px-2 py-1 text-center bg-black bg-opacity-70 rounded-xl" to="/logout">
            <img className="inline-block h-4 mr-1 invert" src={LogoutIconSrc} alt="" />
            Logout
        </Link>
    </>;
}
