import { OpenMode } from "~/common";
import useBrowserState from "./useBrowserState";
import { PropsWithChildren, createContext, useContext } from "react";


const OpenContext = createContext<{
    openMode: OpenMode
    setOpenMode: (m: OpenMode) => void
}>({
    openMode: OpenMode.intern,
    setOpenMode: () => undefined
});


export function Provider(props: PropsWithChildren) {
    const [value, setValue] = useBrowserState("open-mode", OpenMode.intern);

    return <OpenContext.Provider value={{openMode: value, setOpenMode: setValue}}>
        {props.children}
    </OpenContext.Provider>;
}

export default function useOpenMode(): [OpenMode, (m: OpenMode) => void] {
    const context = useContext(OpenContext);
    return [context.openMode, context.setOpenMode];
}
