import usePath from "~/hooks/usePath";
import { Link } from "react-router-dom";
import SettingsIconSrc from "@assets/icons/header/settings.png";


export default function ShowSettings() {
    const path = usePath();

    return <Link to={{pathname: "/settings", search: `?origin=${encodeURIComponent(path)}`}}>
        <img className="inline-block h-5 my-auto cursor-pointer" src={SettingsIconSrc} alt="⚙" />
    </Link>;
}
