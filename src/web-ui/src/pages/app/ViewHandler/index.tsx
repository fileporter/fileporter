import axios from "axios";
import { useQuery } from "react-query";
import Loading from "~/elements/Loading";
import usePath from "~/hooks/usePath";
import PageNotFound from "./views/NotFound";
import ErrorMessageBox from "~/elements/ErrorMessageBox";
import { ApiResponse, DirectoryRootTypeResponse, FileTypeResponse } from "~/types";
import HandleFile from "./HandleFile";
import HandleDirectory from "./HandleDirectory";


export default function ViewHandler() {
    const path = usePath();
    const query = useQuery(
        ["meta", path],
        ({ signal }) => axios.get<ApiResponse>(`${path}`, { signal }),
    )
    
    if (query.isLoading) return <Loading />;
    if (query.data?.status === axios.HttpStatusCode.NotFound) {
        return <PageNotFound />
    }
    if (query.isError) return <ErrorMessageBox error={query.error as Error} />;
    if (!query.isSuccess) return null;

    if (query.data.data.type === "file") {
        return <HandleFile {...query.data.data as FileTypeResponse} />
    } else {
        return <HandleDirectory {...query.data.data as DirectoryRootTypeResponse} />
    }
}
