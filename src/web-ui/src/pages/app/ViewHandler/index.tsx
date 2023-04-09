import axios, { AxiosError } from "axios";
import { useQuery } from "react-query";
import Loading from "~/elements/Loading";
import usePath from "~/hooks/usePath";
import PageNotFound from "./NotFound";
import ErrorMessageBox from "~/elements/ErrorMessageBox";
import { ApiResponse } from "~/types";
import HandleFile from "./HandleFile";
import HandleDirectory from "./HandleDirectory";


export default function ViewHandler() {
    const path = usePath();
    const query = useQuery<ApiResponse, AxiosError>(
        ["meta", path],
        ({ signal }) => axios.get<ApiResponse>(`/api/${path}`, { signal }).then(r => r.data),
    );

    if (query.isLoading) return <Loading />;
    // if (query.error?.status === axios.HttpStatusCode.NotFound) {
    //     return <PageNotFound />;
    // }
    if (query.isError) return <ErrorMessageBox error={query.error as Error} />;
    if (!query.isSuccess) return null;

    if (query.data.type === "file") {
        return <HandleFile {...query.data} />;
    } else {
        return <HandleDirectory {...query.data} />;
    }
}
