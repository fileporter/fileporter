export * from "./enums";
export * from "./sorts";


export function formatDuration(duration: number): string {
    const seconds = Math.floor(duration % 60);
    const minutes = Math.floor((duration / 60) % 60);
    const hours = Math.floor((duration / 60 / 60));
    return `${hours ? `${hours}:` : ""}${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
}
