import axios from "axios";
import { useQuery } from "react-query";
import ErrorMessageBox from "~/elements/ErrorMessageBox";
import Loading from "~/elements/Loading";
import usePath from "~/hooks/usePath";


export default function TextSupport() {
    const path = usePath();
    const query = useQuery<string, Error>(
        ["file", path],
        ({ signal }) => axios.get<string>(`/files/${path}`, { signal }).then(r => r.data),
    );
    if (query.isLoading) return <Loading />;
    if (query.isError) return <ErrorMessageBox error={query.error} />;

    return <pre className="px-2 leading-5 break-words whitespace-break-spaces">
        {query.data}
    </pre>;
}
