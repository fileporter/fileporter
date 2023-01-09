import { useState } from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { apiQuery, apiUrl, OpenMode, ViewEnum } from "../../common";
import { ApiResponse, DirectoryRootTypeResponse, FileTypeResponse } from "../../types";
import Loading from "../Loading";
import ViewToggleHeader from "../ControlHeader/ViewToggle";
import OpenModeToggleHeader from "../ControlHeader/OpenModeToggle";
import { MediaSupportIndex } from "../SupportedMediaViews";

import GalleryView from "./gallery";
import IconView from "./icon";
import ListView from "./list";


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

    function setCurrentView(view: ViewEnum) {
        localStorage.setItem("view", view.toString());
        setView(view);
    }
    function setOpenMode(mode: OpenMode) {
        localStorage.setItem("open-mode", mode.toString());
        setMode(mode);
    }

    const location = useLocation();
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
        window.location.href = apiUrl(`/files/${query.data!.path}`);
        return null;
    }
    const data = query.data as DirectoryRootTypeResponse;
    const contents = !data.basename.length ? data.contents : data.contents.concat({
        type: "directory",
        basename: "..",
        path: data.directory,
        directory: data.directory + "/..",
    });

    const View = viewMap[currentView] ?? IconView;
    return <>
        <OpenModeToggleHeader {...{openMode, setOpenMode}} />
        <ViewToggleHeader {...{currentView, setCurrentView}} />
        <View data={data} contents={contents} openMode={openMode} />
    </>
}
