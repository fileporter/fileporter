import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { apiQuery } from "~/common";
import type { ApiResponse, DirectoryRootTypeResponse, FileTypeResponse } from "~/types";
import Loading from "~/elements/Loading";
import ErrorMessageBox from "~/elements/ErrorMessageBox";
import FileView from "./FileView";
import DirectoryView from "./DirectoryView";


export default function ViewManager() {
    const location = useLocation();
    const path = location.pathname;
    const query = useQuery<ApiResponse, Error>(path, ({ signal }) => apiQuery(path, { signal }));

    if (query.isLoading) {
        return <Loading />;
    }
    if (query.isError) {
        return <ErrorMessageBox error={query.error} />;
    }

    if (query.data!.type === "file") {
        return <FileView {...query.data as FileTypeResponse} />;
    } else {
        return <DirectoryView {...query.data as DirectoryRootTypeResponse} />;
    }
}
