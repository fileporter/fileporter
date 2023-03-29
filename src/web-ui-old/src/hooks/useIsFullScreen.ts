import { useEffect, useState } from "react";

export default function useIsFullScreen(): boolean {
    const [isFullScreen, setFullScreen] = useState(() => !!document.fullscreenElement);

    useEffect(() => {
        document.addEventListener("fullscreenchange", () => {
            setFullScreen(!!document.fullscreenElement);
        });
    }, [setFullScreen]);

    return isFullScreen;
}
