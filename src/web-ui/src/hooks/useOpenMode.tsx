import { createContext, PropsWithChildren, useContext, useState } from "react";
import { OpenMode } from "~/common";

const getDefault = () => parseInt(localStorage.getItem("open-mode") ?? OpenMode.intern.toString());

const ViewContext = createContext<{
    viewMode: OpenMode
    setViewMode: (m: OpenMode) => void
}>({
    viewMode: getDefault(),
    setViewMode: () => undefined
});


export function Provider(props: PropsWithChildren) {
    const [value, set] = useState<OpenMode>(getDefault);

    function setMode(mode: OpenMode) {
        localStorage.setItem("open-mode", mode.toString());
        set(mode);
    }

    return <ViewContext.Provider value={{viewMode: value, setViewMode: setMode}}>
        {props.children}
    </ViewContext.Provider>;
}


export default function useOpenMode(): [OpenMode, (m: OpenMode) => void] {
    const context = useContext(ViewContext);
    return [context.viewMode, context.setViewMode];
}
