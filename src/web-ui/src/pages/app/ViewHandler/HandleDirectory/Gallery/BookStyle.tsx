import type { FileOrDirectory, FileTypeResponse } from "~/api/types";
import type { DirectoryHandlerProps } from "../types";
import IconView from "../Icon";
import { serverUrl } from "~/config";
import { createRef, useEffect, useRef } from "react";


// same as tailwind's snap-x
const ScrollSnapType = "x var(--tw-scroll-snap-strictness)";

export default function BookModeView({ contents }: DirectoryHandlerProps) {
    const containerRef = createRef<HTMLDivElement>();
    const timeoutRef = useRef<NodeJS.Timeout>();

    const notImages: FileOrDirectory[] = [];
    const images: FileTypeResponse[] = [];

    contents.forEach(item => {
        if (item.type === "file" && item.mime?.startsWith("image/")) {
            images.push(item);
        } else {
            notImages.push(item);
        }
    });

    // scrolling horizontally
    // note: this needs to remove the scroll-snap or it wouldn't work
    useEffect(() => {
        const container = containerRef.current;
        if (!container) {
            return;
        }
        const controller = new AbortController();

        window.addEventListener("wheel", (event) => {
            event.preventDefault();
            container.style.scrollSnapType = "none";
            container.scrollLeft += event.deltaY;
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
                container.style.scrollSnapType = ScrollSnapType;
                timeoutRef.current = undefined;
            }, 350);
        }, { passive: false, signal: controller.signal });

        return () => controller.abort();
    }, [containerRef.current]);

    // return <div ref={containerRef} className="flex h-full gap-1 overflow-x-scroll snap-x snap-mandatory">
    return <div ref={containerRef} className="flex h-full gap-1 overflow-x-scroll snap-mandatory" style={{scrollSnapType: ScrollSnapType}}>
        <div className="w-[80vw] snap-start shrink-0 max-h-[90vh] overflow-y-scroll">
            <IconView contents={notImages} />
        </div>
        {images.map(file => <BookModeRenderImage key={file.path} {...file} />)}
        {/* dead end for better scroll snapping */}
        <div className="w-4 snap-none shrink-0 sm:w-48" />
    </div>;
}


export function BookModeRenderImage(file: FileTypeResponse) {
    const imgSrc = serverUrl(`/low-resolution/${file.path}`);
    return <img className="my-auto h-full max-h-[90vh] max-w-[95vw] snap-center object-contain" src={imgSrc} />;
}
