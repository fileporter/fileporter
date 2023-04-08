import { QueryClient } from "react-query";
import { HttpError } from "./common";
import axios from "axios";


axios.defaults.baseURL = import.meta.env.PROD ? 
    import.meta.env.BASE_URL : (() => {
        const url = new URL(import.meta.env.BASE_URL, window.location.origin);
        url.port = "8000";
        return url.toString();
    })();
axios.defaults.timeout = 15_000;
axios.defaults.withCredentials = true;


export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: (failureCount, error,) => {
                if (error instanceof HttpError) {
                    return false;
                }
                return failureCount > 3;
            }
        }
    }
});
