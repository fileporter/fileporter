import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { apiQuery, apiUrl, numberBaseSort, OpenMode, SortMode, textBasedSort, ViewEnum } from "~/common";
import { ApiResponse, DirectoryRootTypeResponse, FileTypeResponse } from "~/types";
import Loading from "../Loading";
import ViewToggleHeader from "../ControlHeader/ViewToggle";
import OpenModeToggleHeader from "../ControlHeader/OpenModeToggle";
import SortModeToggleHeader from "../ControlHeader/SortModeToggle";
import { MediaSupportIndex } from "../SupportedMediaViews";

import GalleryView from "./gallery";
import IconView from "./icon";
import ListView from "./list";
import FullScreenToggle from "../ControlHeader/FullScreenButton";


const viewMap = {
    [ViewEnum.icon]: IconView,
    [ViewEnum.list]: ListView,
    [ViewEnum.gallery]: GalleryView,
}


export interface ViewProps {
    data: DirectoryRootTypeResponse
    contents: DirectoryRootTypeResponse["contents"]
    openMode: OpenMode
}


export default function ViewManager() {
    const [currentView, setView] = useState<ViewEnum>(() => parseInt(localStorage.getItem("view") ?? ViewEnum.icon.valueOf().toString()));
    const [openMode, setMode] = useState<OpenMode>(() => parseInt(localStorage.getItem("open-mode") ?? OpenMode.intern.valueOf().toString()));
    const [sortMode, setSort] = useState<SortMode>(() => parseInt(localStorage.getItem("sort-mode") ?? SortMode.alphabetic.valueOf().toString()));

    function setCurrentView(view: ViewEnum) {
        localStorage.setItem("view", view.toString());
        setView(view);
    }
    function setOpenMode(mode: OpenMode) {
        localStorage.setItem("open-mode", mode.toString());
        setMode(mode);
    }
    function setSortMode(mode: SortMode) {
        localStorage.setItem("sort-mode", mode.toString());
        setSort(mode);
    }

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

    const View = viewMap[currentView] ?? IconView;
    return <>
        <FullScreenToggle />
        <SortModeToggleHeader {...{sortMode, setSortMode}}/>
        <OpenModeToggleHeader {...{openMode, setOpenMode}} />
        <ViewToggleHeader {...{currentView, setCurrentView}} />
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
