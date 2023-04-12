import { SortMode, ViewMode, numberBasedSort, textBasedSort } from "~/common";
import useSortMode from "~/hooks/useSortMode";
import useViewMode from "~/hooks/useViewMode";
import { DirectoryRootTypeResponse } from "~/types";
import IconView from "./Icon";
import ListView from "./List";
import GalleryView from "./Gallery";


const viewMap = {
    [ViewMode.icon]: IconView,
    [ViewMode.list]: ListView,
    [ViewMode.gallery]: GalleryView,
}


export default function HandleDirectory(directory: DirectoryRootTypeResponse) {
    const [viewMode] = useViewMode();
    const [sortMode] = useSortMode();

    console.log(directory);

    const contents = (
        !directory.basename.length ?
            directory.contents
            :
            directory.contents.concat({
                type: "directory",
                basename: "..",
                path: directory.parent,
                parent: `${directory.parent}/..`
            })
        ).sort(sortMode === SortMode.alphabetic ? textBasedSort : numberBasedSort);

    const View = viewMap[viewMode] ?? GalleryView; 

    return <View contents={contents} />;
}
