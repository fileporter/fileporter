import usePath from "~/hooks/usePath";
import { Link } from "react-router-dom";
import SettingsIconSrc from "@assets/icons/header/settings.png";
import { useEffect, useState } from "react";


export default function ShowSettings() {
    const path = usePath();
    const scrollY = useScrollY();

    return <Link className="flex-shrink-0 my-auto h-fit"
        to={{
            pathname: "/settings",
            search: new URLSearchParams({
                origin: path.length ? path : "/",
                scrollY: `${scrollY}`,
            }).toString(),
        }}
        title="open the settings to configure your experience"
    >
        <img className="h-5 cursor-pointer" src={SettingsIconSrc} alt="⚙" />
    </Link>;
}


function useScrollY() {
    const [scrollY, setScrollY] = useState(window.scrollY);

    useEffect(() => {
        const controller = new AbortController();

        window.addEventListener("scroll", () => {
            setScrollY(window.scrollY);
        }, { passive: true, signal: controller.signal });

        return () => controller.abort();
    }, [setScrollY]);

    return scrollY;
}
