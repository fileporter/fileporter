import "./gfm.css"; // use github-flavoured-markdown
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
import type { FileTypeResponse } from "~/api/types";
import api from "~/api";


export default function DotMarkdownSupport(file: FileTypeResponse) {
    const path = usePath();
    const query = useQuery<string>(
        ["file", path],
        ({ signal }) => api.rawFile({ params: { path }, signal }),
    );

    const rendered = useMemo(() => renderMarkdown(query.data, serverUrl(`/files/${file.parent}/`)), [query.data]);

    if (query.isError) {
        return <ErrorMessageBox error={query.error} />;
    }
    if (query.isLoading) {
        return <Loading />;
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
