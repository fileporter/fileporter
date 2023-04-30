import type { FileTypeResponse } from "~/api/types";
import { Document, Page } from "react-pdf/dist/esm/entry.vite";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { serverUrl } from "~/config";
import { createRef, useEffect, useState } from "react";
import Loading from "~/elements/Loading";


export default function PdfSupport(file: FileTypeResponse) {
    const [numPages, setNumPages] = useState<number>();
    const loadingBar = createRef<HTMLProgressElement>();
    const [pageWidth, setPageWidth] = useState<number>(window.innerWidth);

    useEffect(() => {
        const controller = new AbortController();

        window.addEventListener("resize", () => {
            setPageWidth(window.innerWidth);
        }, { passive: true, signal: controller.signal });

        return () => controller.abort();
    });

    return <>
        {!numPages &&
            <progress className="w-full" value={0} max={file.size} ref={loadingBar} />
        }
        <Document
            className="max-w-[100vw] overflow-x-hidden"
            file={serverUrl(`/files/${file.path}`)}
            externalLinkRel="_blank"
            options={{
                withCredentials: true,
            }}
            loading={Loading}
            onLoadProgress={({ loaded, total }) => {
                if (loadingBar.current) {
                    loadingBar.current.value = loaded;
                    if (total) {
                        loadingBar.current.max = total;
                    }
                }
            }}
            onLoadSuccess={(pdf) => {
                setNumPages(pdf.numPages);
            }}
        >
            {Array.from(
                new Array(numPages),
                (_, pageNumber) => (
                    <Page
                        key={pageNumber} className="mx-auto w-fit max-w-[100px]"
                        pageIndex={pageNumber}
                        loading={Loading}
                        // you can't set the with to max-w-screen
                        width={Math.min(pageWidth, 1000)}
                    />
                ),
            )}
        </Document>
    </>;
}
