import useCrossTabState from "./useCrossTabState";
import type { PropsWithChildren } from "react";
import { createContext, useContext } from "react";
import { OpenMode, SortMode, ViewMode } from "~/common";


interface Settings {
    preview: boolean
    viewMode: ViewMode,
    sortMode: SortMode,
    openMode: OpenMode,
}

const defaultSettings: Settings = {
    preview: true,
    viewMode: ViewMode.gallery,
    sortMode: SortMode.alphabetic,
    openMode: OpenMode.intern,
};

const SettingsContext = createContext<{
    settings: Settings
    setSettings: (s: Settings) => void
        }>({
            settings: defaultSettings,
            setSettings: () => undefined,
        });


export function Provider(props: PropsWithChildren) {
    const [settings, setSettings] = useCrossTabState("settings", defaultSettings);

    return <SettingsContext.Provider value={{settings, setSettings}}>
        {props.children}
    </SettingsContext.Provider>;
}

export default function useSettings(): [Settings, (s: Settings) => void] {
    const { settings, setSettings } = useContext(SettingsContext);
    return [settings, setSettings];
}

export function useSetting<K extends keyof Settings>(key: K): [Settings[K], (n: Settings[K]) => void] {
    const { settings, setSettings } = useContext(SettingsContext);

    const value = settings[key];

    function setValue(nextValue: Settings[K]) {
        setSettings({...settings, [key]: nextValue});
    }

    return [value, setValue];
}
