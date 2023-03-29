import { PropsWithChildren } from "react";
import { Provider as OpenModeProvider } from "./useOpenMode";
import { Provider as SortModeProvider } from "./useSortMode";
import { Provider as ViewModeProvider } from "./useViewMode";


export default function HookProviders(props: PropsWithChildren) {
    return <>
        <OpenModeProvider>
            <SortModeProvider>
                <ViewModeProvider>
                    {props.children}
                </ViewModeProvider>
            </SortModeProvider>
        </OpenModeProvider>
    </>;
}
