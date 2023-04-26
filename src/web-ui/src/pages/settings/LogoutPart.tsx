import { Link } from "react-router-dom";
import LogoutIconSrc from "@assets/icons/logout-icon.png?inline";
import { useQuery } from "react-query";
import api from "~/api";


export default function LogoutPart() {
    const query = useQuery(
        ["is-logged-in"],
        ({ signal }) => api.isLoggedIn({ signal }),
    );

    if (!query.isSuccess || !query.data) {
        return null;
    }

    return <>
        <Link className="w-full max-w-xs px-2 py-1 text-center bg-darker bg-opacity-70 rounded-xl group" to="/logout">
            <img className="inline-block h-4 mr-1 invert" src={LogoutIconSrc} alt="" />
            <span className="group-hover:underline">Logout</span>
        </Link>
    </>;
}
