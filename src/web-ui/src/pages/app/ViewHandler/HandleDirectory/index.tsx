import { SortMode, ViewMode, numberBasedSort, textBasedSort } from "~/common";
import type { DirectoryRootTypeResponse } from "~/api/types";
import IconView from "./Icon";
import ListView from "./List";
import GalleryView from "./Gallery";
import { useSetting } from "~/hooks/useSettings";
import type { DirectoryHandlerProps } from "./types";


const viewMap: Record<ViewMode, undefined | ((props: DirectoryHandlerProps) => JSX.Element) > = {
    [ViewMode.icon]: IconView,
    [ViewMode.list]: ListView,
    [ViewMode.gallery]: GalleryView,
};


export default function HandleDirectory(directory: DirectoryRootTypeResponse) {
    const [viewMode] = useSetting("viewMode");
    const [sortMode] = useSetting("sortMode");

    const contents = (
        directory.basename === "." ?
            directory.contents
            :
            directory.contents.concat({
                type: "directory",
                basename: "..",
                path: directory.parent,
                parent: `${directory.parent}/../`,
            })
    ).sort(sortMode === SortMode.alphabetic ? textBasedSort : numberBasedSort);

    const View = viewMap[viewMode] ?? GalleryView;

    return <View contents={contents} />;
}
