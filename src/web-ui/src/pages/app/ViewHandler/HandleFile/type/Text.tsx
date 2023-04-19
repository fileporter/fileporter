import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import { useQuery } from "react-query";
import ErrorMessageBox from "~/elements/ErrorMessageBox";
import Loading from "~/elements/Loading";
import usePath from "~/hooks/usePath";
import type { FileTypeResponse } from "~/api/types";
import ScrollProgressFix from "~/components/ScrollProgressFix";
import api from "~/api";


export default function TextSupport(file: FileTypeResponse) {
    const path = usePath();
    const query = useQuery<string>(
        ["file", path],
        ({ signal }) => api.rawFile({ params: { path }, signal }),
    );
    if (query.isError) {
        return <ErrorMessageBox error={query.error} />;
    }
    if (query.isLoading) {
        return <Loading />;
    }

    if (file.mime?.startsWith("text/x-")) {
        const hl = hljs.highlightAuto(query.data!);
        if (hl.language) {
            return <>
                <ScrollProgressFix />
                <pre className="px-2 leading-5 break-words whitespace-break-spaces" dangerouslySetInnerHTML={{__html: hl.value}}></pre>
            </>;
        }
    }
    return <pre className="px-2 leading-5 break-words whitespace-break-spaces">
        <ScrollProgressFix />
        {query.data}
    </pre>;
}
