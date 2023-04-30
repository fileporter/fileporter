import { useEffect, useRef, useState } from "react";
import PathBar from "./PathBar";
import ShowSettings from "./ShowSettings";
import ToggleFullScreen from "./ToggleFullScreen";


export default function AppHeader() {
    const [isVisible, setVisible] = useState(true);
    const lastScrolled = useRef<number>(0);
    const [isTopMost, setTopMost] = useState(true);

    useEffect(() => {
        const controller = new AbortController();

        document.addEventListener("scroll", () => {
            const scrolled = window.scrollY;
            setVisible(scrolled < lastScrolled.current);
            setTopMost(window.scrollY <= 25);
            lastScrolled.current = scrolled;
        }, { passive: true, signal: controller.signal });

        return () => controller.abort();
    });

    return <nav className="sticky z-10 flex gap-3 px-2 py-px transition-[top] duration-300 bg-black bg-opacity-80" style={{top: (isTopMost || isVisible) ? "0px" : "-100%"}}>
        <PathBar />
        <ToggleFullScreen />
        <ShowSettings />
    </nav>;
}
