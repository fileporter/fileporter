import usePath from "~/hooks/usePath";
import { Link } from "react-router-dom";
import SearchIconSrc from "@assets/icons/header/search.png";


export default function ShowSearch() {
    const path = usePath();
    return <Link className="my-auto h-fit" to={{pathname: "/search", search: `?origin=${encodeURIComponent(path)}`}}>
        <img className="h-5 cursor-pointer" src={SearchIconSrc} alt="🔎" />
    </Link>;
}
