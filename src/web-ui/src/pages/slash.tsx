import { AxiosError, HttpStatusCode } from "axios";
import { useQuery } from "react-query";
import { Navigate } from "react-router-dom";
import api from "~/api";
import ErrorMessageBox from "~/elements/ErrorMessageBox";
import Loading from "~/elements/Loading";


export default function URLIndexPage() {
    const query = useQuery(
        ["check-access"],
        ({ signal }) => api.checkAccess({ signal }),
    );

    if (query.isLoading || query.isRefetching) {
        return <Loading />;
    }
    if (query.isError) {
        if (query.error instanceof AxiosError && query.error.response?.status === HttpStatusCode.Unauthorized ) {
            return <Navigate to="/login" /> ;
        }
        return <ErrorMessageBox error={query.error} />;
    }
    return <Navigate replace to="/~/" />;
}
