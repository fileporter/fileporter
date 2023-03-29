import { FileOrDirectory } from "~/types";


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
