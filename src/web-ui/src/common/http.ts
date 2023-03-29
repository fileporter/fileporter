import httpStatusIndex from "./httpStatusIndex";


export class HttpError extends Error {
    status: number;

    constructor(status: number) {
        super(`${status} ${httpStatusIndex[status]}`);
        this.status = status;
    }
}


export function apiUrl(location: string): string {
    const url = new URL(location, window.location.origin)
    if (process.env.NODE_ENV !== "production") {
        url.port = "8000";
    }
    return url.toString();
}


export function apiQuery(location: string, init: RequestInit) {
    init.credentials = "include";
    return fetch(apiUrl(`/api/${location}`), init)
        .then(response => {
            if (!response.ok) {
                throw new HttpError(response.status);
            }
            return response.json();
        })
}

