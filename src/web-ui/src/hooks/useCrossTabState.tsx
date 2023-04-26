import { useEffect, useRef, useState } from "react";


export default function useCrossTabState<T>(stateKey: string, defaultValue: T): [T, (n: T) => void] {
    const [state, setState] = useState(defaultValue);
    const isNewSession = useRef(true);

    useEffect(() => {
        if (isNewSession.current) {
            const currentState = localStorage.getItem(stateKey);
            if (currentState) {
                setState(JSON.parse(currentState));
            } else {
                setState(defaultValue);
            }
            isNewSession.current = false;
            return;
        }
        localStorage.setItem(stateKey, JSON.stringify(state));
    }, [state, stateKey, defaultValue]);

    useEffect(() => {
        const controller = new AbortController();
        window.addEventListener("storage", (e) => {
            const { key, newValue } = e;
            if (key === stateKey) {
                setState(JSON.parse(newValue!));
            }
        }, { signal: controller.signal });
        return () => controller.abort();
    }, [stateKey, setState]);

    return [state, setState];
}
