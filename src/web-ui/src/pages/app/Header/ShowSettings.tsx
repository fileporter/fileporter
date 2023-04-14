import usePath from "~/hooks/usePath";
import SettingsIconSrc from "@assets/icons/header/settings.png";
import { Link } from "react-router-dom";


export default function ShowSettings() {
    const path = usePath();

    return <Link to={{pathname: "/settings", search: `?origin=${encodeURIComponent(path)}`}}>
        <img className="inline-block h-5 my-auto cursor-pointer" src={SettingsIconSrc} alt="⚙" />
    </Link>;
}
