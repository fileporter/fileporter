import { useQuery } from "react-query";
import api from "~/api";
import ScrollProgressFix from "~/components/ScrollProgressFix";
import ErrorMessageBox from "~/elements/ErrorMessageBox";
import Loading from "~/elements/Loading";
import usePath from "~/hooks/usePath";


export default function DotJsonSupport() {
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

    try { // maybe rethink this parsing-stringify thing for performance reasons.
        const loaded = JSON.parse(query.data!);
        return <pre className="px-2 overflow-x-scroll leading-5">
            <ScrollProgressFix />
            {JSON.stringify(loaded, null, 2)}
        </pre>;
    } catch (Error) {
        return <>
            <pre className="relative px-2 overflow-x-scroll leading-5">
                <ScrollProgressFix />
                <p className="absolute inset-x-0 top-0 text-xs text-center opacity-50 pointer-events-none">Warning: Bad JSON Format</p>
                {query.data}
            </pre>
        </>;
    }
}
