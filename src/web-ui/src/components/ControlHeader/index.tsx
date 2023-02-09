import { useEffect, useState } from "react";
import PathBar from "./PathBar";

export default function ControlHeader() {
    const [lastY, setLastY] = useState(window.scrollY);
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const controller = new AbortController();

        document.addEventListener("scroll", () => {
            const nowY = window.scrollY;
            const diff = nowY - lastY;
            setOffset(Math.min(Math.max(0, offset + diff/2), 100));
            setLastY(nowY);
        }, { passive: true, signal: controller.signal });
        
        return () => controller.abort();
    });

    const isSticky = offset < 50;

    return <div id="control-header" className="top-0 z-50 flex gap-3 px-2 py-px bg-black bg-opacity-75 rounded-md" style={{position: isSticky ? "sticky" : "initial"}}>
        <PathBar />
    </div>
}
