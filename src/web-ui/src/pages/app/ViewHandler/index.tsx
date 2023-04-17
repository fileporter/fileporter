import { AxiosError } from "axios";
import axios from "axios";
import { useQuery } from "react-query";
import Loading from "~/elements/Loading";
import usePath from "~/hooks/usePath";
import ErrorMessageBox from "~/elements/ErrorMessageBox";
import type { ApiResponse } from "~/types";
import HandleFile from "./HandleFile";
import HandleDirectory from "./HandleDirectory";
import PageNotFound from "./NotFound";


export default function ViewHandler() {
    const path = usePath();
    const query = useQuery<ApiResponse>(
        ["meta", path],
        ({ signal }) => axios.get<ApiResponse>(`/api/${path}`, { signal }).then(r => r.data),
    );

    if (query.isLoading) {
        return <Loading />;
    }
    if (query.error instanceof AxiosError && query.error.response?.status === axios.HttpStatusCode.NotFound) {
        return <PageNotFound />;
    }
    if (query.isError) {
        return <ErrorMessageBox error={query.error} />;
    }
    if (!query.isSuccess) {
        return null;
    }

    if (query.data.type === "file") {
        return <HandleFile {...query.data} />;
    } else {
        return <HandleDirectory {...query.data} />;
    }
}
