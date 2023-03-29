import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { apiQuery, apiUrl, numberBaseSort, OpenMode, SortMode, textBasedSort, ViewMode } from "~/common";
import { ApiResponse, DirectoryRootTypeResponse, FileTypeResponse } from "~/types";
import Loading from "../Loading";
import ViewToggleHeader from "../ControlHeader/ViewToggle";
import OpenModeToggleHeader from "../ControlHeader/OpenModeToggle";
import SortModeToggleHeader from "../ControlHeader/SortModeToggle";
import { MediaSupportIndex } from "../SupportedMediaViews";
import FullScreenToggle from "../ControlHeader/FullScreenButton";
import useViewMode from "~/hooks/useViewMode";
import useOpenMode from "~/hooks/useOpenMode";
import useSortMode from "~/hooks/useSortMode";
import GalleryView from "./Gallery";
import IconView from "./Icon";
import ListView from "./List";


const viewMap = {
    [ViewMode.icon]: IconView,
    [ViewMode.list]: ListView,
    [ViewMode.gallery]: GalleryView,
}


export interface ViewProps {
    data: DirectoryRootTypeResponse
    contents: DirectoryRootTypeResponse["contents"]
    openMode: OpenMode
}


export default function ViewManager() {
    const [viewMode, setViewMode] = useViewMode();
    const [openMode, setOpenMode] = useOpenMode();
    const [sortMode, setSortMode] = useSortMode();

    const location = useLocation();
    const navigate = useNavigate();
    const path = location.pathname;
    const query = useQuery<ApiResponse, Error>(path, ({ signal }) => apiQuery(path, { signal }));

    if (query.isLoading) {
        return <Loading />
    }
    if (query.isError) {
        return <h1 className="text-xl text-center text-red-300">
            {window.navigator.onLine ? 
                `${query.error}`
                :
                "You are offline"
            }
        </h1>
    }
    if (query.data!.type === "file") {
        const file = query.data as FileTypeResponse
        if (openMode === OpenMode.intern) {
            const Comp = MediaSupportIndex[file.mime?.split("/")[0] ?? ""];
            if (Comp) {
                return <Comp {...file} />
            }
        }
        // otherwise these functions could be called multiple times
        return <CallbackComp callback={() => {
            window.open(apiUrl(`/files/${query.data!.path}`), "_blank")?.focus();
            navigate(-1);
        }} />;
    }
    const data = query.data as DirectoryRootTypeResponse;
    const contents = (!data.basename.length ? data.contents : data.contents.concat({
        type: "directory",
        basename: "..",
        path: data.directory,
        directory: data.directory + "/..",
    })).sort(sortMode === SortMode.alphabetic ? textBasedSort : numberBaseSort);

    const View = viewMap[viewMode] ?? IconView;
    return <>
        <FullScreenToggle />
        <SortModeToggleHeader {...{sortMode, setSortMode}}/>
        <OpenModeToggleHeader {...{openMode, setOpenMode}} />
        <ViewToggleHeader currentView={viewMode} setCurrentView={setViewMode} />
        <View data={data} contents={contents} openMode={openMode} />
    </>
}


function CallbackComp({ callback }: {callback: () => void}) {
    // prevent calling this multiple times
    useEffect(() => {
        const id = setTimeout(callback, 10);
        return () => clearTimeout(id);
    });

    return null;
}
