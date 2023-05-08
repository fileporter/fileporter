import useCrossTabState from "./useCrossTabState";
import type { PropsWithChildren } from "react";
import { createContext, useContext } from "react";
import { OpenMode, Previews, SortMode, GifLike, ViewMode } from "~/common";


interface Settings {
    viewMode: ViewMode
    sortMode: SortMode
    openMode: OpenMode
    previews: Previews
    gifLike: GifLike
}

const defaultSettings: Settings = {
    viewMode: ViewMode.gallery,
    sortMode: SortMode.alphabetic,
    openMode: OpenMode.intern,
    previews: Previews.enabled,
    gifLike: GifLike.enabled,
};

const SettingsContext = createContext<{
    settings: Settings
    setSettings: (s: Settings) => void
        }>({
            settings: defaultSettings,
            setSettings: () => undefined,
        });


export function SettingsProvider(props: PropsWithChildren) {
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

    let value: Settings[K] | undefined = settings[key];
    value ??= defaultSettings[key];

    function setValue(nextValue: Settings[K]) {
        setSettings({...settings, [key]: nextValue});
    }

    return [value, setValue];
}
