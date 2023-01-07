import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { apiQuery, ViewEnum } from "../../common";
import { ApiResponse, DirectoryRootTypeResponse } from "../../types";
import Loading from "../Loading";
import Page404NotFound from "../Page404NotFound";

import GalleryView from "./gallery";
import IconView from "./icon";
import ListView from "./list";


const viewMap = {
    [ViewEnum.icon]: IconView,
    [ViewEnum.list]: ListView,
    [ViewEnum.gallery]: GalleryView,
}


interface Props {
    view: ViewEnum
}
export interface ViewProps {
    data: DirectoryRootTypeResponse
    contents: DirectoryRootTypeResponse["contents"]
}


export default function ViewManager(props: Props) {
    const location = useLocation();
    const path = location.pathname;
    const query = useQuery<ApiResponse, Error>(path, ({ signal }) => apiQuery(path, { signal }));

    if (query.isLoading) {
        return <Loading />
    }
    if (query.isError) {
        return <h1 className="text-xl text-center text-red-300">
            {`${query.error}`}
        </h1>
    }
    if (query.data!.type === "file") {
        return <Page404NotFound />
    }
    const data = query.data as DirectoryRootTypeResponse;
    const contents = !data.basename.length ? data.contents : data.contents.concat({
        type: "directory",
        basename: "..",
        path: data.path + "/..",
    });

    const View = viewMap[props.view];
    return <View data={data} contents={contents} />;
}
