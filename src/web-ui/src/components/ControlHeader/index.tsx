import { useEffect, useState } from "react";
import PathBar from "./PathBar";

export default function ControlHeader() {
    const [isVisible, setVisible] = useState(true);
    const [lastScrollTop, setLastTop] = useState(0);
    const isTopMost = window.scrollY <= 20; // could also be 0

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
        {(isTopMost) ?
            <div key="control-header" id="control-header" className="relative z-50 flex gap-3 px-2 py-px bg-black bg-opacity-75 rounded-md">
                <PathBar />
            </div>
            :
            <div key="control-header" id="control-header" className="sticky inset-x-0 z-50 flex gap-3 px-2 py-px transition-all duration-300 bg-black bg-opacity-75 rounded-md" style={{top: isVisible ? "0px" : "-100%"}}>
                <PathBar />
            </div>
        }
    </>;
}
