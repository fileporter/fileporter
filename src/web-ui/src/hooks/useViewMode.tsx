import { createContext, PropsWithChildren, useContext, useState } from "react";
import { ViewMode } from "~/common";

const getDefault = () => parseInt(localStorage.getItem("view") ?? ViewMode.icon.valueOf().toString());

const ViewContext = createContext<{
    viewMode: ViewMode
    setViewMode: (m: ViewMode) => void
}>({
    viewMode: getDefault(),
    setViewMode: () => undefined
});


export function Provider(props: PropsWithChildren) {
    const [value, set] = useState<ViewMode>(getDefault);

    function setMode(mode: ViewMode) {
        localStorage.setItem("open-mode", mode.toString());
        set(mode);
    }

    return <ViewContext.Provider value={{viewMode: value, setViewMode: setMode}}>
        {props.children}
    </ViewContext.Provider>;
}


export default function useViewMode(): [ViewMode, (m: ViewMode) => void] {
    const context = useContext(ViewContext);
    return [context.viewMode, context.setViewMode];
}
