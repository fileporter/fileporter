import { SortMode, ViewMode, numberBasedSort, textBasedSort } from "~/common";
import useSortMode from "~/hooks/useSortMode";
import useViewMode from "~/hooks/useViewMode";
import type { DirectoryRootTypeResponse } from "~/api/types";
import IconView from "./Icon";
import ListView from "./List";
import GalleryView from "./Gallery";


const viewMap: Record<ViewMode, undefined | ((props: { contents: DirectoryRootTypeResponse["contents"] }) => JSX.Element) > = {
    [ViewMode.icon]: IconView,
    [ViewMode.list]: ListView,
    [ViewMode.gallery]: GalleryView,
};


export default function HandleDirectory(directory: DirectoryRootTypeResponse) {
    const [viewMode] = useViewMode();
    const [sortMode] = useSortMode();

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
