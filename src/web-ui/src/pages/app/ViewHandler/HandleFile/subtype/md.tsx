import "./gfm.css"; // use github-flavoured-markdown
import axios from "axios";
import DOMPurify from "dompurify";
import hljs from "highlight.js";
import * as marked from "marked";
import { useMemo } from "react";
import { useQuery } from "react-query";
import ScrollProgressFix from "~/components/ScrollProgressFix";
import { serverUrl } from "~/config";
import ErrorMessageBox from "~/elements/ErrorMessageBox";
import Loading from "~/elements/Loading";
import usePath from "~/hooks/usePath";
import type { FileTypeResponse } from "~/types";


export default function DotMarkdownSupport(file: FileTypeResponse) {
    const path = usePath();
    const query = useQuery<string>(
        ["file", path],
        ({ signal }) => axios.get<string>(`/files/${path}`, { signal, responseType: "text" }).then(r => r.data),
    );

    const rendered = useMemo(() => renderMarkdown(query.data, serverUrl(`/files/${file.parent}/`)), [query.data]);

    if (query.isLoading) {
        return <Loading />;
    }
    if (query.isError) {
        return <ErrorMessageBox error={query.error} />;
    }

    return <>
        <ScrollProgressFix />
        <div className="px-2 mx-auto max-w-7xl markdown-body" dangerouslySetInnerHTML={{__html: rendered}} />;
    </>;
}

function renderMarkdown(markdown: undefined | string, baseUrl?: string): string {
    if (markdown === undefined) {
        return "";
    }
    return DOMPurify.sanitize(
        marked.marked(markdown, {
            baseUrl: baseUrl,
            gfm: true,
            breaks: true,
            highlight: (code, lang) => {
                try {
                    return hljs.highlight(code, { language: lang }).value;
                } catch (Error) { // unknown language
                    return code;
                }
            },
            silent: true,
            smartypants: true, // eg: converts ... to …
        }),
    );
}
