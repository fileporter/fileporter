import { useEffect, useState } from "react";
import useIsFullScreen from "~/hooks/useIsFullScreen";
import PathBar from "./PathBar";

export default function ControlHeader() {
    const isFullScreen = useIsFullScreen();
    const [isVisible, setVisible] = useState(true);
    const [lastScrollTop, setLastTop] = useState(0);
    const isTopMost = window.scrollY <= 25;  // could also be 0

    useEffect(() => {
        const controller = new AbortController();

        document.addEventListener("scroll", () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;

            setVisible(scrollTop < lastScrollTop);
            setLastTop(scrollTop);
        }, { passive: true, signal: controller.signal });
        
        return () => controller.abort();
    });

    return <>
        {(isTopMost || isFullScreen) ?
            <div id="control-header" className="inset-x-0 z-50 flex gap-3 px-2 py-px bg-black bg-opacity-75 rounded-md">
                <PathBar />
            </div>
            :
            <div id="control-header" className="fixed inset-x-0 z-50 flex gap-3 px-2 py-px transition-all duration-300 bg-black bg-opacity-75 rounded-md" style={{top: isVisible ? "0px" : "-100%"}}>
                <PathBar />
            </div>
        }
    </>
}
