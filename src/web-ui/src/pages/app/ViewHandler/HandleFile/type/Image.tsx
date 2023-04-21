import { useEffect, useMemo, useRef } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { SortMode, numberBasedSort, textBasedSort } from "~/common";
import { serverUrl } from "~/config";
import useSortMode from "~/hooks/useSortMode";
import type { FileTypeResponse } from "~/api/types";
import api from "~/api";


export default function ImageSupport(file: FileTypeResponse) {
    const navigate = useNavigate();
    const [sortMode] = useSortMode();
    const prog = useRef<null | HTMLProgressElement>();
    const query = useQuery(
        ["meta", file.parent],
        ({ signal }) => api.getFileMeta({ params: { path: file.parent }, signal }),
        { staleTime: 60_000 },
    );
    const imageList = useMemo(() => (
        query.data?.type !== "directory"
            ? undefined
            : query.data.contents
                .filter(el => el.type === "file" && (
                    el.mime?.startsWith("image/")
                    || (el.has_video && !el.has_audio && el.duration && el.duration <= 60)
                ))
                .sort(sortMode === SortMode.alphabetic ? textBasedSort : numberBasedSort)
    ), [query.data]);

    function getCurrentIndex() {
        return imageList?.findIndex(el => el.path === file.path) ?? -1;
    };

    function setPrevious() {
        const current = getCurrentIndex();
        const previousImage = current <= 0 ? undefined : imageList?.at(current - 1);
        if (previousImage) {
            navigate(`/~/${previousImage.path}`);
        }
    }

    function setNext() {
        const current = getCurrentIndex();
        const nextImage = current < 0 ? undefined : imageList?.at(current + 1);
        if (nextImage) {
            navigate(`/~/${nextImage.path}`);
        }
    }

    useKeyControl(setPrevious, setNext);
    useTouchControl(setPrevious, setNext);

    // image-preloading for faster swiping
    useEffect(() => {
        const current = getCurrentIndex();
        const previousImage = current <= 0 ? undefined : imageList?.at(current - 1);
        if (previousImage) {
            const img = new Image();
            img.src = serverUrl(`/files/${previousImage.path}`);
        }
        const nextImage = current < 0 ? undefined : imageList?.at(current + 1);
        if (nextImage) {
            const img = new Image();
            img.src = serverUrl(`/files/${nextImage.path}`);
        }
    }, [imageList]);

    const srcUrl = serverUrl(`/files/${file.path}`);

    return <div className="fixed inset-0 w-screen h-screen bg-black">
        {file.has_video ?
            <>
                <video className="w-full h-full"
                    autoPlay loop
                    onTimeUpdate={(event) => {
                        const vid = event.currentTarget;
                        if (prog.current) {
                            prog.current.max = vid.duration;
                            prog.current.value = vid.currentTime;
                        }
                    }}
                    onDoubleClick={(event) => {
                        const vid = event.currentTarget;
                        vid.paused ? vid.play() : vid.pause();
                    }}
                >
                    <source src={srcUrl} type={file.mime} />
                </video>
                <progress className="fixed inset-x-0 bottom-0 w-full h-1 transition-[width]" ref={el => prog.current = el} />
            </>
            :
            <img className="object-contain w-full h-full"
                width={file.size?.width} height={file.size?.height}
                src={srcUrl} alt={file.basename}
            />
        }
    </div>;
}


function useKeyControl(onPrevious: () => void, onNext: () => void) {
    useEffect(() => {
        const controller = new AbortController();

        window.addEventListener("keydown", (event) => {
            switch (event.key) {
            case "ArrowLeft":
                onPrevious();
                break;
            case "ArrowRight":
                onNext();
                break;
            }
        }, { signal: controller.signal });

        return () => controller.abort();
    }, [onPrevious, onNext]);
}

function useTouchControl(onPrevious: () => void, onNext: () => void) {
    const startPos = useRef<undefined | number>();

    useEffect(() => {
        const controller = new AbortController();

        window.addEventListener("touchstart", (event) => {
            startPos.current = event.changedTouches[0].screenX;
        }, { signal: controller.signal });

        window.addEventListener("touchend", (event) => {
            const endPos = event.changedTouches[0].screenX;
            const delta = endPos - startPos.current!;
            const screenWidth = window.screen.width;
            if (Math.abs(delta) > (screenWidth / 3)) {
                if (delta > 0) {
                    onPrevious();
                } else {
                    onNext();
                }
            }
            startPos.current = undefined;
        }, { signal: controller.signal });

        return () => controller.abort();
    }, [onPrevious, onNext]);
}
