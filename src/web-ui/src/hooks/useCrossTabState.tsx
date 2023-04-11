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


// import { useEffect, useState } from "react";


// export default function useBrowserState<T>(storageKey: string, defaultValue: T): [T, (v: T) => void] {
//     function loadValue() {
//         const stored = localStorage.getItem(storageKey);
//         if (stored === null) return defaultValue;
//         return JSON.parse(stored) as T;
//     }

//     const [value, setState] = useState<T>(loadValue);

//     function setValue(newValue: T) {
//         setState(() => {
//             console.log("setValue", value, "=>", newValue);
//             localStorage.setItem(storageKey, JSON.stringify(value));
//             return newValue;
//         })
//     }

//     useEffect(() => {
//         const controller = new AbortController();

//         window.addEventListener("storage", (event) => {
//             const {key, newValue, storageArea} = event;
//             if (key !== storageKey || storageArea !== localStorage) return;
//             console.log(event)
//             console.log({localStorage: localStorage.getItem(storageKey), storageArea: storageArea?.getItem(storageKey)});
//             setState(newValue ? JSON.parse(newValue) : newValue);
//         }, { signal: controller.signal, passive: true, capture: true });

//         return () => controller.abort();
//     }, []);

//     return [value, setValue];
// }
