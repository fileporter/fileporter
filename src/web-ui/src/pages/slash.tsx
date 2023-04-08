import { useQuery } from "react-query";
import { Navigate } from "react-router-dom";
import { apiQuery } from "~/common";

export default function URLIndexPage() {
    const query = useQuery(
        ["api-head"],
        ({ signal }) => apiQuery("/api/", { signal, method: "HEAD" }),
    );

    if (query.isLoading) {
        return <h1 className="text-center">
            Please wait a bit...
        </h1>;
    }
    if (query.isError) {
        return <Navigate to="/login" />        ;
    } else {
        return <Navigate to="/~/" />;
    }
}
