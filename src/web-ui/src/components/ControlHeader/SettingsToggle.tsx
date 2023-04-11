import SettingsIconSrc from "@assets/icons/settings.png";
import useUrlHash from "~/hooks/useUrlHash";


export default function SettingsToggle() {
    const [,setHash] = useUrlHash();

    return <img className="block" src={SettingsIconSrc} onClick={() => {
        setHash(old => (old.length ? "" : "settings"));
    }} />;
}
