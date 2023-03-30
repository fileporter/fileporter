import { useEffect, useMemo } from "react";
import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { apiQuery, apiUrl, numberBaseSort, OpenMode, SortMode, textBasedSort, ViewMode } from "~/common";
import { ApiResponse, DirectoryRootTypeResponse, FileTypeResponse } from "~/types";
import Loading from "../../elements/Loading";
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
import ErrorMessageBox from "~/elements/ErrorMessageBox";


const viewMap = {
    [ViewMode.icon]: IconView,
    [ViewMode.list]: ListView,
    [ViewMode.gallery]: GalleryView,
}


export interface ViewProps {
    data: DirectoryRootTypeResponse
    contents: DirectoryRootTypeResponse["contents"]
}


export default function ViewManager() {
    const location = useLocation();
    const path = location.pathname;
    const query = useQuery<ApiResponse, Error>(path, ({ signal }) => apiQuery(path, { signal }));

    if (query.isLoading) return <Loading />;
    if (query.isError) return <ErrorMessageBox error={query.error} />;
    
    if (query.data!.type === "file") {
        return <FileView {...query.data as FileTypeResponse} />
    } else {
        return <DirectoryView {...query.data as DirectoryRootTypeResponse} />
    }
}


function FileView(file: FileTypeResponse) {
    const [openMode] = useOpenMode();
    const navigate = useNavigate();

    useMemo(() => console.log("callback"), []);
    
    useEffect(() => {
        console.log("OPn")
        return () => console.log("OFF")
    }, [])

    if (openMode === OpenMode.intern) {
        const MediaView = MediaSupportIndex[file.mime?.split("/")[0] ?? ""];
        if (MediaView) {
            return <>
                <FullScreenToggle />
                <MediaView {...file} />
            </>;
        }
    }

    // otherwise these functions could be called multiple times
    return <CallbackComp callback={() => {
        window.open(apiUrl(`/files/${file.path}`), "_blank")?.focus();
        navigate(-1);
    }} />;
}


function DirectoryView(directory: DirectoryRootTypeResponse) {
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

function CallbackComp({ callback }: {callback: () => void}) {
    // prevent calling this multiple times
    useEffect(() => {
        const id = setTimeout(callback, 10);
        return () => clearTimeout(id);
    });

    return null;
}
