import httpStatusIndex from "./httpStatusIndex";
import { FileOrDirectory } from "./types";

export enum ViewEnum {
    icon,
    list,
    gallery,
}
export enum OpenMode {
    intern,
    browser,
}
export enum SortMode {
    alphabetic,
    numeric,
}


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


export function textBasedSort(a: FileOrDirectory, b: FileOrDirectory) {
    if (a.type !== b.type) {
        if (a.type === "directory") return -1;
        if (b.type === "directory") return 1;
    } else {
        const as = a.basename.toLowerCase();
        const bs = b.basename.toLowerCase();
        if (as < bs) return -1;
        if (as > bs) return 1;
    }
    return 0;
}

// different sort than in the others
export function numberBaseSort(a: FileOrDirectory, b: FileOrDirectory) {
    if (a.type !== b.type) {
        if (a.type === "directory") return -1;
        if (b.type === "directory") return 1;
    } else {
        const as = a.basename.toLowerCase();
        const bs = b.basename.toLowerCase();
        if (a.type === "directory") {
            if (as < bs) return -1;
            if (as > bs) return 1;
        } else {
            const an = parseInt(Array.from(as.matchAll(/\d/g)).join(""), 10);
            const bn = parseInt(Array.from(bs.matchAll(/\d/g)).join(""), 10);
            if (an < bn) return -1;
            if (an > bn) return 1;
        }
    }
    return 0;
}
