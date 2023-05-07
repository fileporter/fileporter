import usePath from "~/hooks/usePath";
import { Link } from "react-router-dom";
import SettingsIconSrc from "@assets/icons/header/settings.png";


export default function ShowSettings() {
    const path = usePath();

    return <Link className="flex-shrink-0 my-auto h-fit"
        to={{pathname: "/settings", search: `?origin=${encodeURIComponent(path)}`}}
        title="open the settings to configure your experience"
    >
        <img className="h-5 cursor-pointer" src={SettingsIconSrc} alt="⚙" />
    </Link>;
}
