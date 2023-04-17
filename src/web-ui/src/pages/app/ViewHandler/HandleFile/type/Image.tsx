import axios from "axios";
import { useEffect, useMemo, useState, useRef } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { SortMode, numberBasedSort, textBasedSort } from "~/common";
import { serverUrl } from "~/config";
import useSortMode from "~/hooks/useSortMode";
import type { FileTypeResponse } from "~/types";
import type { DirectoryRootTypeResponse } from "~/types";


export default function ImageSupport(file: FileTypeResponse) {
    const navigate = useNavigate();
    const [sortMode] = useSortMode();
    const [useFullView, setFullView] = useState(true);
    const srcUrl = serverUrl(`/files/${file.path}`);
    const query = useQuery<DirectoryRootTypeResponse>(
        ["meta", file.parent],
        ({ signal }) => axios.get<DirectoryRootTypeResponse>(`/api/${file.parent}`, { signal }).then(r => r.data),
        { staleTime: 60_000 },
    );
    const imageList = useMemo(() => query.data?.contents
        .filter(el => el.type === "file" && el.mime?.startsWith("image/"))
        .sort(sortMode === SortMode.alphabetic ? textBasedSort : numberBasedSort)
    , [query.data]);

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

    return <div className={useFullView ? "fixed inset-0 w-screen h-screen bg-black" : "my-auto"}>
        <img className="object-contain w-full h-full"
            width={file.size?.[0]} height={file.size?.[1]}
            src={srcUrl} alt={file.basename}
            onDoubleClick={() => setFullView(!useFullView)}
        />
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
            if (Math.abs(delta) > 50) { // 50px minimum
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
