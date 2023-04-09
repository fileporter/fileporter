import axios from "axios";
import { useQuery } from "react-query";
import { Navigate } from "react-router-dom";


export default function URLIndexPage() {
    const query = useQuery(
        ["api-head"],
        ({ signal }) => axios.head("/api/", { signal }),
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
