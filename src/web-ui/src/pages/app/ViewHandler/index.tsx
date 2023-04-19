import { AxiosError, HttpStatusCode } from "axios";
import { useQuery } from "react-query";
import Loading from "~/elements/Loading";
import usePath from "~/hooks/usePath";
import ErrorMessageBox from "~/elements/ErrorMessageBox";
import HandleFile from "./HandleFile";
import HandleDirectory from "./HandleDirectory";
import PageNotFound from "./NotFound";
import api from "~/api";
import type { DirectoryRootTypeResponse, FileTypeResponse } from "~/api/types";


export default function ViewHandler() {
    const path = usePath();
    const query = useQuery(
        ["meta", path],
        ({ signal }) => api.getFileMeta({ params: { path }, signal }),
    );

    if (query.isLoading) {
        return <Loading />;
    }
    if (query.error instanceof AxiosError && query.error.response?.status === HttpStatusCode.NotFound) {
        return <PageNotFound />;
    }
    if (query.isError) {
        return <ErrorMessageBox error={query.error} />;
    }

    if (query.data!.type === "file") {
        return <HandleFile {...query.data as FileTypeResponse} />;
    } else {
        return <HandleDirectory {...query.data as DirectoryRootTypeResponse} />;
    }
}
