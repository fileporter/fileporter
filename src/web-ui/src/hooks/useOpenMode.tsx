import { OpenMode } from "~/common";
import useCrossTabState from "./useCrossTabState";
import type { PropsWithChildren} from "react";
import { createContext, useContext } from "react";


const OpenContext = createContext<{
    openMode: OpenMode
    setOpenMode: (m: OpenMode) => void
        }>({
            openMode: OpenMode.intern,
            setOpenMode: () => undefined,
        });


export function Provider(props: PropsWithChildren) {
    const [value, setValue] = useCrossTabState("open-mode", OpenMode.intern);

    return <OpenContext.Provider value={{openMode: value, setOpenMode: setValue}}>
        {props.children}
    </OpenContext.Provider>;
}

export default function useOpenMode(): [OpenMode, (m: OpenMode) => void] {
    const context = useContext(OpenContext);
    return [context.openMode, context.setOpenMode];
}
