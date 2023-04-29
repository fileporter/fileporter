import ReactDOM from "react-dom";
import { type PropsWithChildren, createContext, useState, useEffect } from "react";
import CloseIconSrc from "@assets/icons/cross.svg?inline";


export const ContextMenuContext = createContext<(menu: JSX.Element) => void>(() => undefined);


export default function ContextMenuProvider(props: PropsWithChildren) {
    const [menu, setMenu] = useState<JSX.Element>();

    useEffect(() => {
        if (!menu) {
            return;
        }
        const controller = new AbortController();

        const wheelEvent = "onwheel" in document.createElement("div") ? "wheel" : "mousewheel";
        const opt = { capture: true, passive: false, signal: controller.signal };

        window.addEventListener(wheelEvent, e => e.preventDefault(), opt); // desktop
        window.addEventListener("touchmove", e => e.preventDefault(), opt); // mobile
        window.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                setMenu(undefined);
            }
        }, opt);

        return () => controller.abort();
    }, [menu]);

    return <ContextMenuContext.Provider value={setMenu}>
        {props.children}
        {!!menu && ReactDOM.createPortal(<>
            {/* background */}
            <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm" onDoubleClick={() => setMenu(undefined)} />
            {/* actual popup */}
            <div className="fixed z-50 bg-black border rounded-lg bg-opacity-70 centered border-accent">
                <div className="relative p-2 max-w-[min(500px,90vw)] min-h-[30vh] max-h-[80vh] w-screen flex flex-col gap-1">
                    <button className="absolute top-0 right-0 p-1 translate-x-1/2 -translate-y-1/2 bg-black border rounded-xl border-accent" onClick={() => setMenu(undefined)}>
                        <img className="h-4 invert" src={CloseIconSrc} alt="X" />
                    </button>
                    {menu}
                </div>
            </div>
        </>, document.getElementById("portal")!)}
    </ContextMenuContext.Provider>;
}

