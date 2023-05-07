import { useSetting } from "~/hooks/useSettings";
import IconView from "../Icon";
import type { DirectoryHandlerProps } from "../types";
import { GalleryMode } from "~/common";
import MangaModeView from "./MangaStyle";
import BookModeView from "./BookStyle";


export default function GalleryView({ contents }: DirectoryHandlerProps) {
    const [galleryMode] = useSetting("galleryMode");

    const imageCount = contents.filter(item => item.type === "file" && item.mime?.startsWith("image/")).length;
    const otherCount = contents.length - imageCount;

    // comparing the ratio between image-files and other stuff (directories+files)
    if ((imageCount/otherCount) <= 1.0) {
        return <IconView contents={contents} />;
    } else if (galleryMode === GalleryMode.manga) {
        return <MangaModeView contents={contents} />;
    } else {
        return <BookModeView contents={contents} />;
    }
}
