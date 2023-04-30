import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import api from "~/api";
import ErrorMessageBox from "~/elements/ErrorMessageBox";
import Loading from "~/elements/Loading";
import useContextMenu from "~/hooks/useContextMenu";
import usePath from "~/hooks/usePath";


export default function DotUrlSupport() {
    const setMenu = useContextMenu();
    const path = usePath();
    const query = useQuery<string>(
        ["file", path],
        ({ signal }) => api.rawFile({ params: { path }, signal, responseType: "text" }),
    );
    if (query.isError) {
        return <ErrorMessageBox error={query.error} />;
    }
    if (query.isLoading) {
        return <Loading />;
    }

    const url = parseDotUrlFileContent(query.data!);

    if (url === null) {
        return <pre className="relative px-2 overflow-x-scroll leading-5">
            <p className="absolute inset-x-0 top-0 text-xs text-center opacity-50 pointer-events-none select-none">Warning: Bad .url File <button className="pointer-events-auto" onClick={() => {
                setMenu(<>
                    <p className="text-center select-none">Example File</p>
                    <p className="p-1 border rounded-md border-darker grid grid-cols-[auto,1fr] gap-x-1">
                        <b className="opacity-50 select-none">1</b><span>[InternetShortcut]</span>
                        <b className="opacity-50 select-none">2</b><span>URL=<Link className="hover:underline" target="_blank" to="https://www.lyberty.com/encyc/articles/tech/dot_url_format_-_an_unofficial_guide.html">https://www.lyberty.com/encyc/articles/tech/dot_url_format_-_an_unofficial_guide.html</Link></span>
                    </p>
                </>);
            }}>ⓘ</button></p>
            {query.data}
        </pre>;
    } else {
        return <div className="fixed flex flex-col max-w-md gap-5 text-center -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
            <p className="opacity-75">You are about to leave this page. Are you sure?</p>
            <Link className="text-blue-500 hover:underline" to={url} target="_blank" rel="noreferrer noopener">{url}</Link>
        </div>;
    }
}


/* Minimal .url File:
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * [InternetShortcut]                                                                        *
 * URL=https://www.lyberty.com/encyc/articles/tech/dot_url_format_-_an_unofficial_guide.html *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * yes: this parser is not perfect but it does the job
 */
function parseDotUrlFileContent(content: string): null | string {
    let validSection = false;
    for (const line of content.split("\n")) {
        if (line.startsWith("[") && line.endsWith("]")) {
            validSection = line === "[InternetShortcut]";
        }
        if (validSection && line.toLowerCase().startsWith("url=")) {
            const url = line.slice(4).trim();
            return url;
        }
    }
    return null;
}
