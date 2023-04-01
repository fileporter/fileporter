import { SortMode } from "~/common";
import useBrowserState from "./useBrowserState";
import { PropsWithChildren, createContext, useContext } from "react";


const SortContext = createContext<{
    sortMode: SortMode
    setSortMode: (m: SortMode) => void
}>({
    sortMode: SortMode.alphabetic,
    setSortMode: () => undefined
});


export function Provider(props: PropsWithChildren) {
    const [value, setValue] = useBrowserState("sort-mode", SortMode.alphabetic);

    return <SortContext.Provider value={{sortMode: value, setSortMode: setValue}}>
        {props.children}
    </SortContext.Provider>;
}

export default function useSortMode(): [SortMode, (m: SortMode) => void] {
    const context = useContext(SortContext);
    return [context.sortMode, context.setSortMode];
}
