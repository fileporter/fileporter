import { DirectoryRootTypeResponse } from "~/types"


export interface ViewProps {
    data: DirectoryRootTypeResponse
    contents: DirectoryRootTypeResponse["contents"]
}
