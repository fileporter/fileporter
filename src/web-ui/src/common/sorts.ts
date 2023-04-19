import type { FileOrDirectory } from "~/api/types";


export function textBasedSort(a: FileOrDirectory, b: FileOrDirectory) {
    if (a.type !== b.type) {
        if (a.type === "directory") {
            return -1;
        }
        if (b.type === "directory") {
            return 1;
        }
    } else {
        const as = a.basename.toLowerCase();
        const bs = b.basename.toLowerCase();
        if (as < bs) {
            return -1;
        }
        if (as > bs) {
            return 1;
        }
    }
    return 0;
}


export function numberBasedSort(a: FileOrDirectory, b: FileOrDirectory) {
    // different type? => directory wins
    if (a.type !== b.type) {
        if (a.type === "directory") {
            return -1;
        }
        if (b.type === "directory") {
            return 1;
        }
        return 0;
    }

    const as = a.basename.toLowerCase();
    const bs = b.basename.toLowerCase();

    // means both are directories (second comparison is unnecessary and thus commented)
    if (a.type === "directory" /* && b.type === "directory" */) {
        if (as < bs) {
            return -1;
        }
        if (as > bs) {
            return 1;
        }
        return 0;
    }

    // both are files
    // btw: [0-9] < NaN === [0-9] > NaN === false
    const an = parseInt(Array.from(as.matchAll(/\d/g)).join(""), 10);
    const bn = parseInt(Array.from(bs.matchAll(/\d/g)).join(""), 10);

    // both don't have numbers: sort normal
    if (isNaN(an) && isNaN(bn)) {
        if (as < bs) {
            return -1;
        }
        if (as > bs) {
            return 1;
        }
    }

    // one has a number, this last (directories and text-only-name-files first)
    if (isNaN(an)) {
        return -1;
    }
    if (isNaN(bn)) {
        return 1;
    }

    // otherwise compare the numbers
    if (an < bn) {
        return -1;
    }
    if (an > bn) {
        return 1;
    }
    return 0;
}
