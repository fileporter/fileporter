import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import axios from "axios";
import { useQuery } from "react-query";
import ErrorMessageBox from "~/elements/ErrorMessageBox";
import Loading from "~/elements/Loading";
import usePath from "~/hooks/usePath";
import type { FileTypeResponse } from "~/types";


export default function TextSupport(file: FileTypeResponse) {
    const path = usePath();
    const query = useQuery<string, Error>(
        ["file", path],
        ({ signal }) => axios.get<string>(`/files/${path}`, { signal }).then(r => r.data),
    );
    if (query.isLoading) {
        return <Loading />;
    }
    if (query.isError) {
        return <ErrorMessageBox error={query.error} />;
    }

    if (file.mime?.startsWith("text/x-")) {
        const hl = hljs.highlightAuto(query.data!);
        if (hl.language) {
            return <pre className="px-2 leading-5 break-words whitespace-break-spaces" dangerouslySetInnerHTML={{__html: hl.value}}></pre>;
        }
    }
    return <pre className="px-2 leading-5 break-words whitespace-break-spaces">
        {query.data}
    </pre>;
}
