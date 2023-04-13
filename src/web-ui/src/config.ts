import { QueryClient } from "react-query";
import axios, { AxiosError } from "axios";
import { HTTP_401_UNAUTHORIZED, HTTP_408_REQUEST_TIMEOUT, HTTP_429_TOO_MANY_REQUESTS, HTTP_503_SERVICE_UNAVAILABLE } from "./common/httpStatusIndex";


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
axios.interceptors.response.use(null, (error) => {
    if (error.response?.status === HTTP_401_UNAUTHORIZED) {
        // important: change with different provider
        window.location.assign(`${import.meta.env.BASE_URL}#/login`);
    }
    return Promise.reject(error);
});


export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: (failureCount, error) => {
                if (error instanceof AxiosError) {
                    const status = error.response!.status;
                    return [
                        HTTP_408_REQUEST_TIMEOUT,
                        HTTP_429_TOO_MANY_REQUESTS,
                        HTTP_503_SERVICE_UNAVAILABLE,
                    ].includes(status);
                }
                return failureCount > 3;
            },
        },
    },
});
