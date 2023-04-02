import httpStatusIndex from "./httpStatusIndex";


export class HttpError extends Error {
    status: number;

    constructor(status: number) {
        super(`${status} ${httpStatusIndex[status]}`);
        this.status = status;
    }
}


export function apiUrl(location: string): string {
    let url;
    if (import.meta.env.DEV) {
        url = new URL(location, window.location.origin)
        url.port = "8000";
    } else {
        url = new URL(import.meta.env.BASE_URL + location, window.location.origin)
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

