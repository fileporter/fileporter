import { useQuery } from "react-query";
import { Link, useLocation } from "react-router-dom";
import { apiQuery, sortItems } from "../../common";
import { ApiResponse, DirectoryRootTypeResponse, FileOrDirectory } from "../../types";
import Loading from "../Loading";
import Page404NotFound from "../Page404NotFound";
import FileIcon from "./images/file-earmark.svg";
import FolderIcon from "./images/folder.svg";
import FolderOpenIcon from "./images/folder-open.svg";
import ApiFileLink from "../ApiFileLink";


export default function ListView() {
    const location = useLocation();
    const path = location.pathname;
    const query = useQuery<ApiResponse, Error>(path, ({ signal }) => apiQuery(path, { signal }));

    if (query.isLoading) {
        return <Loading />
    }
    if (query.isError) {
        return <p>{`${query.error}`}</p>
    }
    if (query.data!.type === "file") {
        return <Page404NotFound />
    }
    const data = query.data as DirectoryRootTypeResponse;
    const items = data.contents.concat({
        type: "directory",
        basename: "..",
        path: data.path + "/..",
    });

    return <div className="flex flex-col gap-1">
        {items.sort(sortItems).map(item => <RenderItem key={item.basename} {...item} />)}
    </div>
}


function RenderItem(item: FileOrDirectory) {
    if (item.type === "directory") {
        return <Link to={item.path} className="flex gap-1 group">
            <img className="block w-auto h-6 group-hover:hidden aspect-square" src={FolderIcon} alt="" />
            <img className="hidden w-auto h-6 group-hover:block aspect-square" src={FolderOpenIcon} alt="" />
            <span className="group-hover:underline">
                {item.basename}
            </span>
        </Link>
    } else {
        return <ApiFileLink to={item.path} className="flex gap-1 group">
            <img className="w-auto h-6 aspect-square" src={FileIcon} alt="" />
            <span className="group-hover:underline">
                {item.basename}
            </span>
        </ApiFileLink>
    }
}
