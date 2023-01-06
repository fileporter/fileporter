
interface ResponseBase {
    basename: string,
    path: string,
}
export interface FileTypeResponse extends ResponseBase {
    type: "file",
}
export interface DirectoryTypeResponse extends ResponseBase {
    type: "directory",
}
export type FileOrDirectory = FileTypeResponse | DirectoryTypeResponse;
export interface DirectoryRootTypeResponse extends DirectoryTypeResponse {
    contents: FileOrDirectory[]
}

export type ApiResponse = FileTypeResponse | DirectoryRootTypeResponse
