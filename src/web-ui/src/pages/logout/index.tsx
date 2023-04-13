import axios from "axios";
import { useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import ErrorMessageBox from "~/elements/ErrorMessageBox";
import MiniserveIconSrc from "@assets/images/miniserve.png";


export default function LogoutPage() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const query = useQuery<object, Error>(
        ["logout"],
        ({ signal }) => axios.post("/auth/logout", { signal }),
        { cacheTime: 0, onSuccess: () => {
            queryClient.clear();
            navigate("/", { replace: true });
        } },
    );

    if (query.isLoading) {
        return <div className="flex flex-col items-center justify-center h-screen">
            <img className="w-auto h-1/3 animate-pulse" src={MiniserveIconSrc} alt="" draggable={false} />
            <p>Please wait while you are being logged out</p>
        </div>;
    }
    if (query.isError) {
        return <ErrorMessageBox error={query.error} />;
    }
    return null;
}
