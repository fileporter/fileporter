import type { DirectoryHandlerProps } from "./types";


export default function GalleryView({ contents }: DirectoryHandlerProps) {
    return <>{contents.length}</>;
}
