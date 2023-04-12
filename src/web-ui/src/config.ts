import { QueryClient } from "react-query";
import axios, { AxiosError } from "axios";


export function serverUrl(location: string): string {
    let url;
    if (import.meta.env.DEV) {
        url = new URL(location, window.location.origin);
        url.port = "8000";
    } else {
        url = new URL(import.meta.env.BASE_URL + location.slice(1), window.location.origin);
    }
    return url.toString();
}


axios.defaults.baseURL = serverUrl("/");
// axios.defaults.baseURL = import.meta.env.PROD ?
//     import.meta.env.BASE_URL : (() => {
//         const url = new URL(import.meta.env.BASE_URL, window.location.origin);
//         url.port = "8000";
//         return url.toString();
//     })();
axios.defaults.timeout = 15_000;
axios.defaults.withCredentials = true;


export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: (failureCount, error) => {
                if (error instanceof AxiosError) {
                    return false;
                }
                return failureCount > 3;
            },
        },
    },
});
