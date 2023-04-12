import axios from "axios";
import { useQuery, useQueryClient } from "react-query";
import { Navigate } from "react-router-dom";
import ErrorMessageBox from "~/elements/ErrorMessageBox";


export default function LogoutPage() {
    const queryClient = useQueryClient();
    const query = useQuery<object, Error>(
        ["logout"],
        ({ signal }) => axios.post("/auth/logout", { signal }),
        { cacheTime: 0, onSuccess: () => {
            queryClient.clear();
        } },
    );

    if (query.isLoading) {
        return <p>Please wait while you are logged out</p>;
    }
    if (query.isError) {
        return <ErrorMessageBox error={query.error} />;
    }
    return <Navigate replace to="/" />;
}
