import { SortMode } from "~/common";
import useCrossTabState from "./useCrossTabState";
import { PropsWithChildren, createContext, useContext } from "react";


const SortContext = createContext<{
    sortMode: SortMode
    setSortMode: (m: SortMode) => void
}>({
    sortMode: SortMode.alphabetic,
    setSortMode: () => undefined
});


export function Provider(props: PropsWithChildren) {
    const [value, setValue] = useCrossTabState("sort-mode", SortMode.alphabetic);

    return <SortContext.Provider value={{sortMode: value, setSortMode: setValue}}>
        {props.children}
    </SortContext.Provider>;
}

export default function useSortMode(): [SortMode, (m: SortMode) => void] {
    const context = useContext(SortContext);
    return [context.sortMode, context.setSortMode];
}
