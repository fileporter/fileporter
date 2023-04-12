import { useEffect } from "react";


// on mobile. if the user flips the phone the height of the document changes
// but where your are shouldn't change (it does, because the actual height of the document may/will change)
// that's the purpose of this component.
// if the orientation changes it calculated where the user currently is and scrolls to that position after a short delay
export default function ScrollProgressFix() {
    useEffect(() => {
        const controller = new AbortController();
        window.addEventListener("orientationchange", () => {
            const startOffsetY = window.scrollY;
            const startPageHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight,
                document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
            const percentageScrolled = startOffsetY / startPageHeight;
            setTimeout(() => {
                const pageHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight,
                    document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
                const scrollPos = percentageScrolled * pageHeight;
                document.documentElement.scrollTo({ left: 0, top: scrollPos });
            }, 100);
        });

        return () => controller.abort();
    }, []);
    return null;
}
