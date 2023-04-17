import { useEffect, useState } from "react";

export default function OfflineHeader() {
    const [onLine, setOnLine] = useState(() => window.navigator.onLine);

    useEffect(() => {
        const controller = new AbortController();

        const options: AddEventListenerOptions = {
            capture: true,
            passive: true,
            signal: controller.signal,
        };

        window.addEventListener("offline", () => setOnLine(false), options);
        window.addEventListener("online", () => setOnLine(true), options);

        return () => controller.abort();
    }, [setOnLine]);

    if (onLine) {
        return null;
    }

    return <div className="text-sm text-center bg-error animate-pulse">
        Your are Offline
    </div>;
}
