import { ViewMode } from "~/common";
import useBrowserState from "./useBrowserState";
import { PropsWithChildren, createContext, useContext } from "react";


const ViewContext = createContext<{
    viewMode: ViewMode
    setViewMode: (m: ViewMode) => void
}>({
    viewMode: ViewMode.gallery,
    setViewMode: () => undefined
});


export function Provider(props: PropsWithChildren) {
    const [value, setValue] = useBrowserState("view-mode", ViewMode.gallery);

    return <ViewContext.Provider value={{viewMode: value, setViewMode: setValue}}>
        {props.children}
    </ViewContext.Provider>;
}

export default function useViewMode(): [ViewMode, (m: ViewMode) => void] {
    const context = useContext(ViewContext);
    return [context.viewMode, context.setViewMode];
}
