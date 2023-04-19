import { QueryClient } from "react-query";
import { AxiosError, HttpStatusCode } from "axios";
import { ZodError } from "zod";


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


export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: (failureCount, error) => {
                if (error instanceof AxiosError) {
                    const status = error.response?.status;
                    return failureCount < 5 || (!!status && [
                        HttpStatusCode.TooEarly,
                        HttpStatusCode.RequestTimeout,
                        HttpStatusCode.TooManyRequests,
                        HttpStatusCode.BadGateway,
                        HttpStatusCode.ServiceUnavailable,
                    ].includes(status));
                }
                if (error instanceof ZodError || (error instanceof Error && error.cause instanceof ZodError)) {
                    return false;
                }
                return failureCount < 3;
            },
        },
    },
});
