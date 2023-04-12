import { numberBasedSort, SortMode, textBasedSort, ViewMode } from "~/common";
import type { DirectoryRootTypeResponse } from "~/types";
import ViewToggleHeader from "../ControlHeader/ViewToggle";
import OpenModeToggleHeader from "../ControlHeader/OpenModeToggle";
import SortModeToggleHeader from "../ControlHeader/SortModeToggle";
import FullScreenToggle from "../ControlHeader/FullScreenToggle";
import useViewMode from "~/hooks/useViewMode";
import useSortMode from "~/hooks/useSortMode";
import GalleryView from "~/components/DirectoryViews/Gallery";
import IconView from "~/components/DirectoryViews/Icon";
import ListView from "~/components/DirectoryViews/List";
import { type ViewProps } from "../DirectoryViews";


const viewMap: Record<ViewMode, undefined | ((p: ViewProps) => JSX.Element)> = {
    [ViewMode.icon]: IconView,
    [ViewMode.list]: ListView,
    [ViewMode.gallery]: GalleryView,
};

export default function DirectoryView(directory: DirectoryRootTypeResponse) {
    const [viewMode] = useViewMode();
    const [sortMode] = useSortMode();

    const contents = (!directory.basename.length ? directory.contents : directory.contents.concat({
        type: "directory",
        basename: "..",
        path: directory.parent,
        parent: directory.parent + "/..",
    })).sort(sortMode === SortMode.alphabetic ? textBasedSort : numberBasedSort);

    const View = viewMap[viewMode] ?? IconView;
    return <>
        <FullScreenToggle />
        <SortModeToggleHeader />
        <OpenModeToggleHeader />
        <ViewToggleHeader />
        <View data={directory} contents={contents} />
    </>;
}
