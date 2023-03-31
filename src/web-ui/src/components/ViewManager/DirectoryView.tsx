import { numberBaseSort, SortMode, textBasedSort, ViewMode } from "~/common";
import { DirectoryRootTypeResponse } from "~/types";
import ViewToggleHeader from "../ControlHeader/ViewToggle";
import OpenModeToggleHeader from "../ControlHeader/OpenModeToggle";
import SortModeToggleHeader from "../ControlHeader/SortModeToggle";
import FullScreenToggle from "../ControlHeader/FullScreenButton";
import useViewMode from "~/hooks/useViewMode";
import useSortMode from "~/hooks/useSortMode";
import GalleryView from "~/components/DirectoryViews/Gallery";
import IconView from "~/components/DirectoryViews/Icon";
import ListView from "~/components/DirectoryViews/List";


const viewMap = {
    [ViewMode.icon]: IconView,
    [ViewMode.list]: ListView,
    [ViewMode.gallery]: GalleryView,
}

export default function DirectoryView(directory: DirectoryRootTypeResponse) {
    const [viewMode] = useViewMode();
    const [sortMode] = useSortMode();
    
    const contents = (!directory.basename.length ? directory.contents : directory.contents.concat({
        type: "directory",
        basename: "..",
        path: directory.directory,
        directory: directory.directory + "/..",
    })).sort(sortMode === SortMode.alphabetic ? textBasedSort : numberBaseSort);

    const View = viewMap[viewMode] ?? IconView;
    return <>
        <FullScreenToggle />
        <SortModeToggleHeader />
        <OpenModeToggleHeader />
        <ViewToggleHeader />
        <View data={directory} contents={contents} />
    </>;
}