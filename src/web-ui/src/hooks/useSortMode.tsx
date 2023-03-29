import { createContext, PropsWithChildren, useContext, useState } from "react";
import { SortMode } from "~/common";

const getDefault = () => parseInt(localStorage.getItem("sort-mode") ?? SortMode.alphabetic.valueOf().toString());

const ViewContext = createContext<{
    viewMode: SortMode
    setViewMode: (m: SortMode) => void
}>({
    viewMode: getDefault(),
    setViewMode: () => undefined
});


export function Provider(props: PropsWithChildren) {
    const [value, set] = useState<SortMode>(getDefault);

    function setMode(mode: SortMode) {
        localStorage.setItem("open-mode", mode.toString());
        set(mode);
    }

    return <ViewContext.Provider value={{viewMode: value, setViewMode: setMode}}>
        {props.children}
    </ViewContext.Provider>;
}


export default function useSortMode(): [SortMode, (m: SortMode) => void] {
    const context = useContext(ViewContext);
    return [context.viewMode, context.setViewMode];
}
