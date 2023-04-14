import type { DirectoryHandlerProps } from "../types";
import GridModeRenderItem from "./GridMode";
import ImageModeRenderItem from "./ImageMode";


export default function GalleryView({ contents }: DirectoryHandlerProps) {
    const imageCount = contents.filter(item => item.type === "file" && item.mime?.startsWith("image/")).length;
    const otherCount = contents.length - imageCount;

    // comparing the ratio between image-files and other stuff (directories+files)
    if ((imageCount/otherCount) <= 1.0) {
        return <div className="grid gap-3 px-2 py-1 justify-evenly" style={{gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))"}}>
            {contents.map(item => <GridModeRenderItem key={item.path} {...item} />)}
        </div>;
    } else {
        return <div className="flex flex-col py-1">
            {contents.map(item => <ImageModeRenderItem key={item.path} {...item} />)}
        </div>;
    }
}
