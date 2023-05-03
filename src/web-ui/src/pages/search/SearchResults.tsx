import { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { Link, useSearchParams } from "react-router-dom";
import api from "~/api";
import type { FileOrDirectory } from "~/api/types";
import ErrorMessageBox from "~/elements/ErrorMessageBox";
import FileIcon from "~/elements/FileIcon";
import FolderIcon from "~/elements/FolderIcon";
import Loading from "~/elements/Loading";

const resultLimit = 200;

export default function SearchResults() {
    const [searchParams] = useSearchParams();
    const [query, setQuery] = useState(searchParams.get("query"));
    const timeout = useRef<NodeJS.Timeout>();

    useEffect(() => {
        timeout.current = setTimeout(() => setQuery(searchParams.get("query")), 500);
        return () => clearTimeout(timeout.current);
    }, [searchParams.get("query")]);

    const source = searchParams.get("origin") ?? "/";
    const isRegex = searchParams.get("regex") === "true";
    const isSensitive = searchParams.get("sensitive") === "true";
    const allowFiles = searchParams.get("files") ? searchParams.get("files") === "true" : true;
    const allowDirectories = searchParams.get("directories") ? searchParams.get("directories") === "true" : true;

    const results = useQuery(
        ["search", source, query, isRegex, isSensitive, allowFiles, allowDirectories],
        ({ signal }) => api.search({
            params: { source },
            queries: {
                query: query!,
                mode: isRegex ? "regex" : "fnmatch",
                sensitive: isSensitive,
                files: allowFiles,
                directories: allowDirectories,
            },
            signal,
        }),
        { enabled: !!query?.length },
    );

    return <div className="px-1">
        {!!results.isLoading && <Loading />}
        {!!results.isError && <ErrorMessageBox error={results.error} />}
        {!query?.length && <p className="text-center opacity-50">Enter Query to search</p>}
        {results.data
            ?.slice(0, resultLimit)
            .map(result => <RenderItem key={result.path} {...result} />)
        }
        {!!results.isSuccess && (results.data.length - resultLimit) >= 0 &&
            <p className="text-center opacity-50">{results.data.length - resultLimit} more</p>
        }
        {!!results.isSuccess && results.data.length === 0 &&
            <p className="text-center opacity-50">No Results</p>
        }
    </div>;
}


function RenderItem(item: FileOrDirectory) {
    if (item.type === "directory") {
        return <Link to={`/~/${item.path}`} className="flex gap-1 group">
            <FolderIcon className="grid w-auto h-6 aspect-square place-content-center" />
            <span className="break-words group-hover:underline">
                {item.path}
            </span>
        </Link>;
    } else {
        return <Link to={`/~/${item.realpath}`} className="flex gap-1 group">
            <FileIcon className="w-auto h-6 my-auto aspect-square" file={item} forceIcon />
            <span className="flex break-words group-hover:underline grow">
                {item.path}
            </span>
            <span className="my-auto text-xs text-right opacity-50 group-hover:opacity-100 h-fit max-sm:hidden">{item.mime}</span>
        </Link>;
    }
}
