import { useQuery } from "react-query";
import { Link, useLocation } from "react-router-dom";
import { apiQuery, apiUrl, sortItems } from "../../common";
import { ApiResponse, DirectoryRootTypeResponse, FileOrDirectory } from "../../types";
import Loading from "../Loading";
import Page404NotFound from "../Page404NotFound";
import FolderIcon from "./images/folder.png";
import FolderOpenIcon from "./images/folder-open.png";
import ApiFileLink from "../ApiFileLink";
import FileIcon from "../FileIcon";


export default function IconView() {
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

    return <div className="grid gap-2 px-2 py-1 justify-evenly" style={{gridTemplateColumns: "repeat(auto-fit, minmax(100px, 200px))"}}>
        {items.sort(sortItems).map(item => <RenderItem key={item.basename} {...item} />)}
    </div>
}


function RenderItem(item: FileOrDirectory) {
    if (item.type === "directory") {
        return <Link to={item.path} className="flex flex-col gap-1 group">
            <img className="block w-full h-auto mx-auto aspect-square group-hover:hidden" src={FolderIcon} alt="" />
            <img className="hidden w-full h-auto mx-auto aspect-square group-hover:block" src={FolderOpenIcon} alt="" />
            <span className="text-center group-hover:underline">
                {item.basename}
            </span>
        </Link>
    } else {
        return <ApiFileLink to={item.path} className="flex flex-col gap-1 group">
            <FileIcon className="object-cover w-full h-auto mx-auto rounded-lg aspect-square" imgSrc={apiUrl(`/preview/${item.path}`)} mime={item.mime} /> 
            <span className="w-full text-center break-words group-hover:underline">
                {item.basename}
            </span>
        </ApiFileLink>
    }
}
