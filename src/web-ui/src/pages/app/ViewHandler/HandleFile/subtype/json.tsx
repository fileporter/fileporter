import axios from "axios";
import { useQuery } from "react-query";
import ErrorMessageBox from "~/elements/ErrorMessageBox";
import Loading from "~/elements/Loading";
import usePath from "~/hooks/usePath";


export default function DotJsonSupport() {
    const path = usePath();
    const query = useQuery<string, Error>(
        ["file", path],
        ({ signal }) => axios.get<string>(`/files/${path}`, { signal, responseType: "text" }).then(r => r.data),
    );
    if (query.isLoading) {
        return <Loading />;
    }
    if (query.isError) {
        return <ErrorMessageBox error={query.error} />;
    }

    try { // maybe rethink this parsing-stringify thing for performance reasons.
        const loaded = JSON.parse(query.data!);
        return <pre>
            {JSON.stringify(loaded, null, 2)}
        </pre>;
    } catch (Error) {
        return <>
            <pre className="relative">
                <p className="absolute inset-x-0 top-0 text-xs text-center opacity-50 pointer-events-none">Warning: Bad JSON Format</p>
                {query.data}
            </pre>
        </>;
    }
}
